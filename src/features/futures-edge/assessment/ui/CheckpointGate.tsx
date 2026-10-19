/** Checkpoint entry card. Start is always available; the gate only explains what the checkpoint counts toward. */
import type { CheckpointGateView } from '../checkpoints/gate';
import { CHECKPOINT_DISCLAIMER } from '../checkpoints/disclaimer';
import { EducationOnlyNotice } from './EducationOnlyNotice';

export function CheckpointGate({ view, onStart }: { view: CheckpointGateView; onStart?: () => void }) {
  return (
    <section className="fe-assess-gate" aria-labelledby={`fe-gate-${view.checkpointId}`} data-checkpoint-id={view.checkpointId}>
      <h2 id={`fe-gate-${view.checkpointId}`}>{view.title}</h2>
      {view.isPreview ? <p className="fe-assess-badge fe-assess-badge--preview">Preview</p> : null}
      {view.passed ? <p className="fe-assess-badge fe-assess-badge--done">Passed (education only, not permission to trade live)</p> : null}
      <p aria-live="polite">{view.message}</p>
      {view.recommendedFirst.length ? (
        <p>Recommended first: <span>{view.recommendedFirst.join(', ')}</span></p>
      ) : null}
      <p>{view.gating ? 'This checkpoint counts toward the course completion badge.' : 'This is an optional review. It does not block anything.'}</p>
      <p className="fe-assess-gate__disclaimer">{CHECKPOINT_DISCLAIMER}</p>
      {onStart ? <button type="button" onClick={onStart}>{view.passed ? 'Practise again' : view.isPreview ? 'Practise the preview' : 'Start checkpoint'}</button> : null}
      <EducationOnlyNotice compact />
    </section>
  );
}
