/**
 * ┌──────────────────────────────────────────────────────────────────────────────────────────────┐
 * │ LOCAL-ONLY DEMO ADAPTER. Saved in this browser on this device only. NOT cloud-synced, NOT      │
 * │ durable (the browser may clear it), NOT tamper-proof (anyone can edit localStorage).           │
 * │ Completion stored here is education-only and can never be used as proof of anything.          │
 * └──────────────────────────────────────────────────────────────────────────────────────────────┘
 * kind 'local-demo', durable false (contract). Falls back to in-memory storage when localStorage is unavailable
 * or a write fails (quota, private mode); `persistence()` then reports 'memory' so the UI can say so.
 * Production path: docs/MIGRATION-server-adapter.md (server-graded, versioned question sets).
 */
import type { CheckpointId, CheckpointProgress, LessonId, Progress, QuizAttempt } from '../../contracts';
import { validateProgress } from '../../contracts';
import { LOCAL_DEMO_LABEL, MEMORY_FALLBACK_LABEL } from '../engine/strings';
import type { AssessmentStorageAdapter, PersistenceMode, StorageIssue } from './adapter';
import {
  capAttempts, isValidCheckpointProgress, isValidQuizAttempt, parseBlob, quarantineKeyFor, storageKeyFor,
  type LocalDemoBlob,
} from './schema';
import { MemoryStorage, probeLocalStorage, type StorageLike } from './storage';

const QUARANTINE_MAX_CHARS = 100_000;

export interface LocalDemoAdapterOptions {
  /** Inject a storage (tests, or a host-provided one). `null` forces memory. Omitted → probe window.localStorage. */
  storage?: StorageLike | null;
  now?: () => string;
}

export class LocalOnlyDemoProgressAdapter implements AssessmentStorageAdapter {
  static readonly LABEL = LOCAL_DEMO_LABEL;
  readonly kind = 'local-demo' as const;
  readonly durable = false as const;
  private storage: StorageLike;
  private mode: PersistenceMode;
  private readonly now: () => string;
  private readonly log: StorageIssue[] = [];

  constructor(opts: LocalDemoAdapterOptions = {}) {
    this.now = opts.now ?? (() => new Date().toISOString());
    const s = opts.storage === undefined ? probeLocalStorage() : opts.storage === null ? null : probeLocalStorage(opts.storage);
    if (s) { this.storage = s; this.mode = 'local-storage'; }
    else {
      this.storage = new MemoryStorage(); this.mode = 'memory';
      this.log.push({ code: 'STORAGE_UNAVAILABLE', message: 'localStorage unavailable; using in-memory storage (lost on reload)', at: this.now() });
    }
  }

  get label(): string { return this.mode === 'memory' ? `${LOCAL_DEMO_LABEL} ${MEMORY_FALLBACK_LABEL}` : LOCAL_DEMO_LABEL; }
  persistence(): PersistenceMode { return this.mode; }
  issues(): readonly StorageIssue[] { return this.log; }

  private read(userId: string): LocalDemoBlob {
    let raw: string | null = null;
    try { raw = this.storage.getItem(storageKeyFor(userId)); } catch (e) { this.fallback(`read failed: ${String(e)}`); }
    const parsed = parseBlob(raw, userId, this.now());
    this.log.push(...parsed.issues);
    if (parsed.quarantine && raw !== null) {
      try {
        this.storage.setItem(quarantineKeyFor(userId), raw.slice(0, QUARANTINE_MAX_CHARS));
        this.storage.removeItem(storageKeyFor(userId));
      } catch { /* best effort */ }
    }
    return parsed.blob;
  }

  private write(userId: string, blob: LocalDemoBlob): void {
    blob.savedAt = this.now();
    const text = JSON.stringify(blob);
    try { this.storage.setItem(storageKeyFor(userId), text); }
    catch (e) {
      this.fallback(`write failed: ${String(e)}`);
      this.storage.setItem(storageKeyFor(userId), text);
    }
  }

  private fallback(reason: string): void {
    if (this.mode === 'memory') return;
    const mem = new MemoryStorage();
    this.storage = mem; this.mode = 'memory';
    this.log.push({ code: 'WRITE_FAILED', message: `${reason}; switched to in-memory storage`, at: this.now() });
  }

  async loadLesson(userId: string, lessonId: LessonId): Promise<Progress | null> {
    return this.read(userId).lessons[lessonId] ?? null;
  }
  async loadAll(userId: string): Promise<Progress[]> {
    return Object.values(this.read(userId).lessons).filter((p): p is Progress => p !== undefined);
  }
  async saveLesson(progress: Progress): Promise<void> {
    const r = validateProgress(progress);
    if (!r.ok) throw new TypeError(`refusing to save invalid progress: ${r.errors.map((e) => e.code).join(', ')}`);
    if (progress.educationOnly !== true) throw new TypeError('progress must be educationOnly');
    const blob = this.read(progress.userId);
    blob.lessons[progress.lessonId] = progress;
    this.write(progress.userId, blob);
  }
  async loadCheckpoint(userId: string, id: CheckpointId): Promise<CheckpointProgress | null> {
    return this.read(userId).checkpoints[id] ?? null;
  }
  async saveCheckpoint(progress: CheckpointProgress): Promise<void> {
    if (!isValidCheckpointProgress(progress, progress.userId)) throw new TypeError('refusing to save invalid checkpoint progress');
    const blob = this.read(progress.userId);
    blob.checkpoints[progress.checkpointId] = { ...progress, attempts: capAttempts(progress.attempts) };
    this.write(progress.userId, blob);
  }
  async loadLessonAttempts(userId: string, lessonId: LessonId): Promise<QuizAttempt[]> {
    return this.read(userId).lessonAttempts[lessonId] ?? [];
  }
  async appendLessonAttempt(userId: string, lessonId: LessonId, attempt: QuizAttempt): Promise<void> {
    if (!isValidQuizAttempt(attempt) || attempt.scope.kind !== 'lesson' || attempt.scope.lessonId !== lessonId) throw new TypeError('refusing to save invalid attempt');
    const blob = this.read(userId);
    blob.lessonAttempts[lessonId] = capAttempts([...(blob.lessonAttempts[lessonId] ?? []), attempt]);
    this.write(userId, blob);
  }
  async clear(userId: string): Promise<void> {
    try { this.storage.removeItem(storageKeyFor(userId)); this.storage.removeItem(quarantineKeyFor(userId)); } catch { /* ignore */ }
  }
}
