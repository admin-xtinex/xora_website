import { describe, it, assert } from './harness';
import { LocalOnlyDemoProgressAdapter } from '../progress/local-demo-adapter';
import { MemoryStorage, type StorageLike } from '../progress/storage';
import { LOCAL_DEMO_FORMAT, STORAGE_SCHEMA_VERSION, capAttempts, quarantineKeyFor, storageKeyFor } from '../progress/schema';
import { ProgressService } from '../progress/service';
import { LOCAL_DEMO_LABEL, MEMORY_FALLBACK_LABEL } from '../engine/strings';
import { emptyProgress, LOCAL_PROGRESS_KEY_PREFIX, type QuizAttempt } from '../../contracts';
import { asLessonQuestion, testLesson, Q_SINGLE_PLAIN, Q_TF_LEVERAGE, Q_SINGLE_WAIT } from './fixtures/sample';

const now = () => '2026-10-19T02:30:00.000Z';
const U = 'local-anonymous';
const lesson = testLesson('T19', [asLessonQuestion(Q_SINGLE_PLAIN, 'T19', 1), asLessonQuestion(Q_TF_LEVERAGE, 'T19', 2), asLessonQuestion(Q_SINGLE_WAIT, 'T19', 3)]);

class ThrowingStorage implements StorageLike {
  getItem(): string | null { throw new Error('SecurityError'); }
  setItem(): void { throw new Error('SecurityError'); }
  removeItem(): void { throw new Error('SecurityError'); }
}
class QuotaStorage extends MemoryStorage {
  full = false;
  override setItem(k: string, v: string) { if (this.full && !k.includes('__probe__')) throw new Error('QuotaExceededError'); super.setItem(k, v); }
}

describe('LocalOnlyDemoProgressAdapter: labelling', () => {
  it('is local-demo, non-durable, and labelled as not cloud-synced / not tamper-proof', () => {
    const a = new LocalOnlyDemoProgressAdapter({ storage: new MemoryStorage(), now });
    assert.equal(a.kind, 'local-demo'); assert.equal(a.durable, false);
    assert.equal(a.persistence(), 'local-storage');
    assert.match(a.label, /this device only/); assert.match(a.label, /not cloud-synced/); assert.match(a.label, /not tamper-proof/);
    assert.equal(LocalOnlyDemoProgressAdapter.LABEL, LOCAL_DEMO_LABEL);
  });
  it('namespaces keys with the contract prefix and encodes the user id', () => {
    assert.equal(storageKeyFor('local-anonymous'), `${LOCAL_PROGRESS_KEY_PREFIX}local-anonymous`);
    assert.equal(storageKeyFor('a/b c'), `${LOCAL_PROGRESS_KEY_PREFIX}a%2Fb%20c`);
  });
});

describe('LocalOnlyDemoProgressAdapter: resume across reloads', () => {
  it('lastStepId, viewed and attempts survive a new adapter instance on the same storage', async () => {
    const storage = new MemoryStorage();
    const s1 = new ProgressService(new LocalOnlyDemoProgressAdapter({ storage, now }), { now });
    await s1.recordStep(lesson, { mode: 'animation', itemId: 'T19-A02', offsetMs: 42000 });
    await s1.markSlideViewed(lesson, 'T19-S01');
    // "reload": brand-new adapter + service
    const s2 = new ProgressService(new LocalOnlyDemoProgressAdapter({ storage, now }), { now });
    assert.deepEqual(await s2.resume('T19'), { mode: 'animation', itemId: 'T19-A02', offsetMs: 42000 });
    const st = await s2.openLesson(lesson);
    assert.deepEqual(st.progress.viewed.slides, ['T19-S01']);
    const raw = JSON.parse(storage.getItem(storageKeyFor(U)) as string);
    assert.equal(raw.format, LOCAL_DEMO_FORMAT); assert.equal(raw.storageSchemaVersion, STORAGE_SCHEMA_VERSION);
    assert.match(raw.notice, /not tamper-proof/);
  });
  it('users are isolated', async () => {
    const storage = new MemoryStorage();
    const a = new LocalOnlyDemoProgressAdapter({ storage, now });
    await a.saveLesson(emptyProgress('u1', 'T05', '1.0.0', now()));
    assert.equal(await a.loadLesson('u2', 'T05'), null);
    assert.ok(await a.loadLesson('u1', 'T05'));
  });
  it('clear() removes the blob and quarantine', async () => {
    const storage = new MemoryStorage();
    const a = new LocalOnlyDemoProgressAdapter({ storage, now });
    await a.saveLesson(emptyProgress(U, 'T05', '1.0.0', now()));
    storage.setItem(quarantineKeyFor(U), 'x');
    await a.clear(U);
    assert.deepEqual(storage.keys(), []);
  });
});

describe('LocalOnlyDemoProgressAdapter: corruption tolerance', () => {
  for (const [name, raw, code] of [
    ['invalid JSON', '{"format": "xora', 'CORRUPT_JSON'],
    ['unknown format', JSON.stringify({ hello: 'world' }), 'UNKNOWN_FORMAT'],
    ['future schema', JSON.stringify({ format: LOCAL_DEMO_FORMAT, storageSchemaVersion: 99, userId: U }), 'FUTURE_SCHEMA'],
    ['other user', JSON.stringify({ format: LOCAL_DEMO_FORMAT, storageSchemaVersion: 2, userId: 'someone-else', lessons: {} }), 'USER_MISMATCH'],
  ] as const) {
    it(`${name}: starts fresh, quarantines raw data, reports ${code}, never throws`, async () => {
      const storage = new MemoryStorage();
      storage.setItem(storageKeyFor(U), raw);
      const a = new LocalOnlyDemoProgressAdapter({ storage, now });
      assert.deepEqual(await a.loadAll(U), []);
      assert.ok(a.issues().some((i) => i.code === code));
      assert.equal(storage.getItem(quarantineKeyFor(U)), raw);
      assert.equal(storage.getItem(storageKeyFor(U)), null);
      await a.saveLesson(emptyProgress(U, 'T05', '1.0.0', now()));
      assert.ok(await a.loadLesson(U, 'T05'));
    });
  }
  it('drops individual invalid records but keeps valid ones', async () => {
    const storage = new MemoryStorage();
    const good = emptyProgress(U, 'T05', '1.0.0', now());
    const forgedCompletion = { ...emptyProgress(U, 'T06', '1.0.0', now()), completed: true }; // completed without score
    const notEdu = { ...emptyProgress(U, 'T07', '1.0.0', now()), educationOnly: false };
    const badAttempt = { attemptId: 'x', score: 7 };
    storage.setItem(storageKeyFor(U), JSON.stringify({
      format: LOCAL_DEMO_FORMAT, storageSchemaVersion: 2, userId: U, notice: '', savedAt: now(),
      lessons: { T05: good, T06: forgedCompletion, T07: notEdu, T99: good }, lessonAttempts: { T05: [badAttempt] },
      checkpoints: { CPA: { passed: true } },
    }));
    const a = new LocalOnlyDemoProgressAdapter({ storage, now });
    const all = await a.loadAll(U);
    assert.deepEqual(all.map((p) => p.lessonId), ['T05']);
    assert.deepEqual(await a.loadLessonAttempts(U, 'T05'), []);
    assert.equal(await a.loadCheckpoint(U, 'CPA'), null, 'a forged {passed:true} checkpoint is dropped');
    assert.ok(a.issues().filter((i) => i.code === 'INVALID_RECORD').length >= 5);
  });
  it('refuses to save invalid progress', async () => {
    const a = new LocalOnlyDemoProgressAdapter({ storage: new MemoryStorage(), now });
    await assert.rejects(() => a.saveLesson({ ...emptyProgress(U, 'T05', '1.0.0', now()), completed: true }), /COMPLETION_WITHOUT_ASSESSMENT/);
  });
});

describe('LocalOnlyDemoProgressAdapter: schema migration', () => {
  it('migrates storage schema 1 → 2 and keeps the data', async () => {
    const storage = new MemoryStorage();
    const p = emptyProgress(U, 'T05', '1.0.0', now());
    storage.setItem(storageKeyFor(U), JSON.stringify({ format: LOCAL_DEMO_FORMAT, storageSchemaVersion: 1, userId: U, lessons: { T05: p }, checkpoints: {} }));
    const a = new LocalOnlyDemoProgressAdapter({ storage, now });
    assert.deepEqual(await a.loadLesson(U, 'T05'), p);
    assert.ok(a.issues().some((i) => i.code === 'MIGRATED'));
    await a.saveLesson({ ...p, lastStepId: { mode: 'notes' } });
    assert.equal(JSON.parse(storage.getItem(storageKeyFor(U)) as string).storageSchemaVersion, 2);
  });
});

describe('LocalOnlyDemoProgressAdapter: in-memory fallback', () => {
  it('storage that throws → memory mode with an honest label', async () => {
    const a = new LocalOnlyDemoProgressAdapter({ storage: new ThrowingStorage(), now });
    assert.equal(a.persistence(), 'memory');
    assert.ok(a.label.includes(MEMORY_FALLBACK_LABEL));
    await a.saveLesson(emptyProgress(U, 'T05', '1.0.0', now()));
    assert.ok(await a.loadLesson(U, 'T05'));
    assert.ok(a.issues().some((i) => i.code === 'STORAGE_UNAVAILABLE'));
  });
  it('no storage at all (SSR / Node) → memory', () => {
    assert.equal(new LocalOnlyDemoProgressAdapter({ storage: null, now }).persistence(), 'memory');
    assert.equal(new LocalOnlyDemoProgressAdapter({ now }).persistence(), 'memory', 'Node has no window.localStorage');
  });
  it('quota error during write → switches to memory without losing the write', async () => {
    const storage = new QuotaStorage();
    const a = new LocalOnlyDemoProgressAdapter({ storage, now });
    await a.saveLesson(emptyProgress(U, 'T05', '1.0.0', now()));
    storage.full = true;
    await a.saveLesson(emptyProgress(U, 'T06', '1.0.0', now()));
    assert.equal(a.persistence(), 'memory');
    assert.ok(await a.loadLesson(U, 'T06'));
    assert.ok(a.issues().some((i) => i.code === 'WRITE_FAILED'));
  });
});

describe('attempt history cap', () => {
  it('keeps the newest N plus the best older attempt and its remediation', () => {
    const mk = (id: string, score: number): QuizAttempt => ({ attemptId: id, scope: { kind: 'lesson', lessonId: 'T05' }, questionSetVersion: 'v', answers: [], score, safetyCriticalAllCorrect: true, startedAt: now() });
    const list = [mk('best', 1), mk('best~rem1', 1), ...Array.from({ length: 40 }, (_, i) => mk(`a${i}`, 0.1))];
    const kept = capAttempts(list, 30);
    assert.equal(kept.length, 32);
    assert.equal(kept[0]?.attemptId, 'best'); assert.equal(kept[1]?.attemptId, 'best~rem1');
  });
});
