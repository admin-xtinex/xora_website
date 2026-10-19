/**
 * Local demo storage schema + migrations + record validators (EDGE-09).
 * One namespaced blob per user under `${LOCAL_PROGRESS_KEY_PREFIX}${encodeURIComponent(userId)}` (contract key prefix).
 * History: storage schema 1 = { lessons, checkpoints } (first internal draft shape; never shipped to users);
 *          storage schema 2 = adds lessonAttempts + notice (current). The v1→v2 migration exists and is tested so the
 *          mechanism is proven before any real user data exists.
 */
import {
  CHECKPOINT_IDS, ID_PATTERNS, LESSON_IDS, LOCAL_PROGRESS_KEY_PREFIX, PROGRESS_SCHEMA_VERSION, isLessonId, validateProgress,
  type CheckpointId, type CheckpointProgress, type LessonId, type Progress, type QuizAttempt,
} from '../../contracts';
import { LOCAL_DEMO_LABEL } from '../engine/strings';
import type { StorageIssue } from './adapter';

export const LOCAL_DEMO_FORMAT = 'xora.futuresEdge.localDemoProgress' as const;
export const STORAGE_SCHEMA_VERSION = 2 as const;
export const MAX_ATTEMPTS_STORED_PER_SCOPE = 30;
const LESSON_MODES = ['learn', 'slides', 'animation', 'practice', 'quiz', 'notes', 'review'];

export interface LocalDemoBlob {
  format: typeof LOCAL_DEMO_FORMAT;
  storageSchemaVersion: typeof STORAGE_SCHEMA_VERSION;
  userId: string;
  notice: string;
  lessons: Partial<Record<LessonId, Progress>>;
  lessonAttempts: Partial<Record<LessonId, QuizAttempt[]>>;
  checkpoints: Partial<Record<CheckpointId, CheckpointProgress>>;
  savedAt: string;
}

export function storageKeyFor(userId: string): string {
  return `${LOCAL_PROGRESS_KEY_PREFIX}${encodeURIComponent(userId)}`;
}
export const quarantineKeyFor = (userId: string) => `${storageKeyFor(userId)}.quarantine`;

export function emptyBlob(userId: string, now: string): LocalDemoBlob {
  return { format: LOCAL_DEMO_FORMAT, storageSchemaVersion: STORAGE_SCHEMA_VERSION, userId, notice: LOCAL_DEMO_LABEL, lessons: {}, lessonAttempts: {}, checkpoints: {}, savedAt: now };
}

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);
const isIso = (v: unknown) => typeof v === 'string' && !Number.isNaN(Date.parse(v));
const strArr = (v: unknown) => Array.isArray(v) && v.every((x) => typeof x === 'string');

export function isValidQuizAttempt(x: unknown): x is QuizAttempt {
  if (!isObj(x)) return false;
  if (typeof x['attemptId'] !== 'string' || !x['attemptId'] || typeof x['questionSetVersion'] !== 'string') return false;
  const s = x['scope'];
  if (!isObj(s)) return false;
  if (s['kind'] === 'lesson' ? !isLessonId(s['lessonId']) : s['kind'] === 'checkpoint' ? !(CHECKPOINT_IDS as readonly unknown[]).includes(s['checkpointId']) : true) return false;
  const score = x['score'];
  if (typeof score !== 'number' || !(score >= 0 && score <= 1)) return false;
  if (typeof x['safetyCriticalAllCorrect'] !== 'boolean' || !isIso(x['startedAt'])) return false;
  if (x['finishedAt'] !== undefined && !isIso(x['finishedAt'])) return false;
  const answers = x['answers'];
  if (!Array.isArray(answers)) return false;
  return answers.every((a) => {
    if (!isObj(a) || !ID_PATTERNS.question.test(String(a['questionId'])) || typeof a['correct'] !== 'boolean' || typeof a['safetyCritical'] !== 'boolean' || !isIso(a['answeredAt'])) return false;
    const r = a['response'];
    if (!isObj(r)) return false;
    if (r['choiceIds'] !== undefined && !strArr(r['choiceIds'])) return false;
    if (r['numeric'] !== undefined && (typeof r['numeric'] !== 'number' || !Number.isFinite(r['numeric']))) return false;
    return true;
  });
}

export function isValidCheckpointProgress(x: unknown, userId: string): x is CheckpointProgress {
  return isObj(x) && x['progressSchemaVersion'] === PROGRESS_SCHEMA_VERSION && x['userId'] === userId
    && (CHECKPOINT_IDS as readonly unknown[]).includes(x['checkpointId']) && typeof x['checkpointVersion'] === 'string'
    && Array.isArray(x['attempts']) && x['attempts'].every(isValidQuizAttempt) && typeof x['passed'] === 'boolean'
    && isIso(x['lastUpdatedAt']) && x['educationOnly'] === true;
}

export function isValidLessonProgress(x: unknown, userId: string, lessonId: string): x is Progress {
  if (!validateProgress(x).ok) return false;
  const p = x as Progress;
  if (p.userId !== userId || p.lessonId !== lessonId) return false;
  if (p.lastStepId !== null && !(isObj(p.lastStepId) && LESSON_MODES.includes(String(p.lastStepId.mode)))) return false;
  return strArr(p.viewed.slides) && strArr(p.viewed.scenesCompleted) && typeof p.viewed.notesRead === 'boolean'
    && strArr(p.practiced.exerciseIdsCompleted) && Number.isInteger(p.assessed.attempts) && p.assessed.attempts >= 0
    && typeof p.assessed.safetyCriticalPassed === 'boolean';
}

/** Keep the newest N attempts plus the best older full attempt and its remediation rounds (so a pass is never lost). */
export function capAttempts(list: QuizAttempt[], max = MAX_ATTEMPTS_STORED_PER_SCOPE): QuizAttempt[] {
  if (list.length <= max) return list;
  const recent = list.slice(-max);
  const older = list.slice(0, -max).filter((a) => !a.attemptId.includes('~rem'));
  const best = older.reduce<QuizAttempt | undefined>((b, a) => (!b || a.score > b.score || (a.score === b.score && a.safetyCriticalAllCorrect && !b.safetyCriticalAllCorrect) ? a : b), undefined);
  if (!best) return recent;
  const keep = list.slice(0, -max).filter((a) => a.attemptId === best.attemptId || a.attemptId.startsWith(`${best.attemptId}~rem`));
  return [...keep, ...recent];
}

export interface ParsedBlob { blob: LocalDemoBlob; issues: StorageIssue[]; quarantine: boolean }

/** Parse whatever is stored. Never throws. Bad records are dropped individually; unreadable blobs are quarantined. */
export function parseBlob(raw: string | null, userId: string, now: string): ParsedBlob {
  const issues: StorageIssue[] = [];
  const issue = (code: StorageIssue['code'], message: string) => issues.push({ code, message, at: now });
  if (raw === null) return { blob: emptyBlob(userId, now), issues, quarantine: false };
  let data: unknown;
  try { data = JSON.parse(raw); } catch {
    issue('CORRUPT_JSON', 'stored progress was not valid JSON; started fresh and kept a quarantine copy');
    return { blob: emptyBlob(userId, now), issues, quarantine: true };
  }
  if (!isObj(data) || data['format'] !== LOCAL_DEMO_FORMAT || typeof data['storageSchemaVersion'] !== 'number') {
    issue('UNKNOWN_FORMAT', 'stored progress has an unknown format; started fresh and kept a quarantine copy');
    return { blob: emptyBlob(userId, now), issues, quarantine: true };
  }
  const v = data['storageSchemaVersion'];
  if (v > STORAGE_SCHEMA_VERSION) {
    issue('FUTURE_SCHEMA', `stored progress uses storage schema ${v} (newer than ${STORAGE_SCHEMA_VERSION}); kept a quarantine copy, did not overwrite it in place`);
    return { blob: emptyBlob(userId, now), issues, quarantine: true };
  }
  if (data['userId'] !== userId) {
    issue('USER_MISMATCH', 'stored progress belongs to another user id; started fresh');
    return { blob: emptyBlob(userId, now), issues, quarantine: true };
  }
  let d: Obj = data;
  if (v === 1) {
    d = { ...d, storageSchemaVersion: 2, lessonAttempts: {}, notice: LOCAL_DEMO_LABEL };
    issue('MIGRATED', 'migrated local progress from storage schema 1 to 2');
  } else if (v !== 2) {
    issue('UNKNOWN_FORMAT', `unsupported storage schema ${v}`);
    return { blob: emptyBlob(userId, now), issues, quarantine: true };
  }
  const blob = emptyBlob(userId, now);
  blob.savedAt = isIso(d['savedAt']) ? (d['savedAt'] as string) : now;
  const lessons = isObj(d['lessons']) ? d['lessons'] : {};
  for (const [id, p] of Object.entries(lessons)) {
    if (isLessonId(id) && isValidLessonProgress(p, userId, id)) blob.lessons[id] = p;
    else issue('INVALID_RECORD', `dropped invalid lesson progress record ${JSON.stringify(id)}`);
  }
  const att = isObj(d['lessonAttempts']) ? d['lessonAttempts'] : {};
  for (const [id, list] of Object.entries(att)) {
    if (!isLessonId(id) || !Array.isArray(list)) { issue('INVALID_RECORD', `dropped attempt list ${JSON.stringify(id)}`); continue; }
    const good = list.filter((a): a is QuizAttempt => isValidQuizAttempt(a) && a.scope.kind === 'lesson' && a.scope.lessonId === id);
    if (good.length !== list.length) issue('INVALID_RECORD', `dropped ${list.length - good.length} invalid attempt(s) for ${id}`);
    blob.lessonAttempts[id] = good;
  }
  const cps = isObj(d['checkpoints']) ? d['checkpoints'] : {};
  for (const [id, p] of Object.entries(cps)) {
    if ((CHECKPOINT_IDS as readonly string[]).includes(id) && isValidCheckpointProgress(p, userId) && p.checkpointId === id) blob.checkpoints[id as CheckpointId] = p;
    else issue('INVALID_RECORD', `dropped invalid checkpoint record ${JSON.stringify(id)}`);
  }
  return { blob, issues, quarantine: false };
}

export const ALL_LESSON_IDS: readonly LessonId[] = LESSON_IDS;
