/** Remediation-link resolver: D-67 (contracts v1.3.1) anchor rules applied at run time, never stranding the learner. */
import { describe, it, assert } from './harness';
import { renderToStaticMarkup } from 'react-dom/server';
import { anchorIndexFromLessons, parseRemediationAnchor, resolveRemediationTarget } from '../engine/remediation';
import { remediationRefIssues, validateLessonQuestionSet } from '../question-sets/validator';
import { SafetyCriticalCallout } from '../ui/SafetyCriticalCallout';
import { gradeAttempt } from '../engine/grader';
import { Q_TF_LEVERAGE, testLesson } from './fixtures/sample';
import type { Lesson, Question } from '../../contracts';

const lessonStub = (id: 'T12' | 'T17', slides: string[], notes: string[], scenes: string[] = []) =>
  ({ id, slides: slides.map((s) => ({ id: s })), notesSections: notes.map((n) => ({ id: n })), animationScenes: scenes.map((a) => ({ id: a })) }) as unknown as Lesson;

describe('remediation link resolver (anchorId, D-67)', () => {
  it('parses slide / notes / transitional scene anchors and rejects other ids', () => {
    assert.deepEqual(parseRemediationAnchor('T12-S03'), { lessonId: 'T12', kind: 'slide', transitional: false });
    assert.deepEqual(parseRemediationAnchor('T03-N06'), { lessonId: 'T03', kind: 'notes', transitional: false });
    assert.deepEqual(parseRemediationAnchor('T14-A06'), { lessonId: 'T14', kind: 'scene', transitional: true });
    for (const bad of ['T12-X01', 'T12-Q02', 'T24-S01', 'T12-S00', 'S03', '', 7, undefined]) assert.equal(parseRemediationAnchor(bad), null, String(bad));
  });
  it('resolves a valid cross-lesson anchor (T17-Q06 → T12-S03) and labels it', () => {
    const t = resolveRemediationTarget({ remediationRef: { lessonId: 'T12', anchorId: 'T12-S03' }, linkedLessonId: 'T17' });
    assert.deepEqual(t, { lessonId: 'T12', anchorId: 'T12-S03', anchorKind: 'slide', transitional: false, label: 'Review T12, slide T12-S03' });
  });
  it('falls back to the lesson start with a reason: no ref, no anchor, bad format, other lesson, not found, invalid lesson', () => {
    const cases: Array<[Question['remediationRef'] | undefined, string, string]> = [
      [undefined, 'T17', 'no-remediation-ref'],
      [{ lessonId: 'T12' }, 'T12', 'no-anchor'],
      [{ lessonId: 'T12', anchorId: 'T12-X01' }, 'T12', 'anchor-format'],
      [{ lessonId: 'T12', anchorId: 'T13-S02' }, 'T12', 'anchor-other-lesson'],
      [{ lessonId: 'T12', anchorId: 'T12-S09' }, 'T12', 'anchor-not-found'],
      [{ lessonId: 'T99' as 'T12', anchorId: 'T12-S03' }, 'T17', 'invalid-lesson'],
    ];
    const idx = anchorIndexFromLessons([lessonStub('T12', ['T12-S03'], ['T12-N06'])]);
    for (const [ref, lessonId, reason] of cases) {
      const t = resolveRemediationTarget({ remediationRef: ref, linkedLessonId: 'T17' }, { anchorExists: idx });
      assert.equal(t.anchorKind, 'lesson-start', reason); assert.equal(t.anchorId, undefined, reason);
      assert.equal(t.lessonId, lessonId, reason); assert.equal(t.fallbackReason, reason);
    }
  });
  it('an anchor into a lesson that is not loaded is trusted (format-valid), scene anchors are marked transitional', () => {
    const idx = anchorIndexFromLessons([lessonStub('T17', ['T17-S03'], [])]);
    assert.equal(resolveRemediationTarget({ remediationRef: { lessonId: 'T12', anchorId: 'T12-S03' }, linkedLessonId: 'T17' }, { anchorExists: idx }).anchorId, 'T12-S03');
    const sc = resolveRemediationTarget({ remediationRef: { lessonId: 'T17', anchorId: 'T17-A04' }, linkedLessonId: 'T17' });
    assert.equal(sc.anchorKind, 'scene'); assert.equal(sc.transitional, true); assert.equal(sc.label, 'Review T17, animation T17-A04');
  });
  it('validator: lesson items get warnings, the codes match the fallback reasons; missing in-lesson anchors are flagged', () => {
    assert.deepEqual(remediationRefIssues({ lessonId: 'T12', anchorId: 'T12-S03' }), []);
    assert.deepEqual(remediationRefIssues({ lessonId: 'T14', anchorId: 'T14-A06' }).map((i) => i.code), ['Q_REMEDIATION_ANCHOR_TRANSITIONAL']);
    assert.deepEqual(remediationRefIssues({ lessonId: 'T12', anchorId: 'T13-S02' }).map((i) => i.code), ['Q_REMEDIATION_ANCHOR_OTHER_LESSON']);
    assert.deepEqual(remediationRefIssues({ lessonId: 'T12', anchorId: 'T12-Q02' }).map((i) => i.code), ['Q_REMEDIATION_ANCHOR_FORMAT']);
    const l = testLesson('T12', [{ ...Q_TF_LEVERAGE, id: 'T12-Q02', linkedLessonId: 'T12', remediationRef: { lessonId: 'T12', anchorId: 'T12-S77' } }]);
    const v = validateLessonQuestionSet(l);
    assert.deepEqual(v.errors.filter((e) => e.code.startsWith('Q_REMEDIATION')), []);
    assert.ok(v.warnings.some((w) => w.code === 'Q_REMEDIATION_ANCHOR_NOT_FOUND'));
  });
  it('grader attaches the resolved target; SafetyCriticalCallout renders it and applies the anchor index', () => {
    const q: Question = { ...Q_TF_LEVERAGE, id: 'T17-Q06', linkedLessonId: 'T17', remediationRef: { lessonId: 'T12', anchorId: 'T12-S03' } };
    const r = gradeAttempt({ scope: { kind: 'lesson', lessonId: 'T17' }, questionSetVersion: 'v', questions: [q], responses: { 'T17-Q06': { choiceIds: ['true'] } }, attemptId: 'a', startedAt: 'x', finishedAt: 'x' });
    const f = r.safetyFailures[0];
    assert.ok(f); assert.equal(f.linkedLessonId, 'T17'); assert.equal(f.remediationTarget.anchorId, 'T12-S03');
    const html = renderToStaticMarkup(<SafetyCriticalCallout failures={r.safetyFailures} onOpenRemediation={() => {}} />);
    assert.match(html, /data-remediation-anchor="T12-S03"/); assert.match(html, /Review T12, slide T12-S03/);
    const idx = anchorIndexFromLessons([lessonStub('T12', ['T12-S01'], [])]);
    const html2 = renderToStaticMarkup(<SafetyCriticalCallout failures={r.safetyFailures} onOpenRemediation={() => {}} anchorExists={idx} />);
    assert.match(html2, /data-remediation-kind="lesson-start"/); assert.match(html2, /Review T12 from the start/);
  });
});
