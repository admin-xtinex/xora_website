import type { CheckpointId } from '@futures-edge/contracts';
import { FeLink } from '../FeLink';
import { pathFor } from '../router';

export function CheckpointView({ checkpointId }: { checkpointId: CheckpointId }) {
  return (
    <section aria-labelledby="fe-page-title">
      <h1 id="fe-page-title" className="fe-title" tabIndex={-1}>
        Checkpoint {checkpointId}
      </h1>
      <div role="alert" className="fe-alert" data-testid="fe-checkpoint-unavailable">
        Checkpoint {checkpointId} is not available in this build. It is not marked as started or passed.
      </div>
      <p>
        <FeLink to={pathFor({ name: 'home' })} className="fe-link">
          Back to the course
        </FeLink>
      </p>
    </section>
  );
}

export function NotFoundView() {
  return (
    <section aria-labelledby="fe-page-title">
      <h1 id="fe-page-title" className="fe-title" tabIndex={-1}>
        Page not found
      </h1>
      <p>There is no Futures Edge page at this address.</p>
      <p>
        <FeLink to={pathFor({ name: 'home' })} className="fe-link">
          Go to the course overview
        </FeLink>
      </p>
    </section>
  );
}
