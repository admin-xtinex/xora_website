import type { CheckpointConfig, CheckpointId } from '@futures-edge/contracts';

const loaders = import.meta.glob<{ default: CheckpointConfig }>('./cp*.ts');

export function loadCheckpoint(id: CheckpointId): Promise<CheckpointConfig> {
  const l = loaders[`./${id.toLowerCase()}.ts`];
  return l ? l().then((m) => m.default) : Promise.reject(new Error(`Checkpoint ${id} is not available yet`));
}

export const CHECKPOINT_TITLES: Record<CheckpointId, string> = {
  CP1: 'Checkpoint 1 · Crypto foundations (optional)',
  CPA: 'Checkpoint A · Batch 1 review (T01–T13)',
  CPB: 'Checkpoint B · Batch 2 review (T14–T23)',
};
