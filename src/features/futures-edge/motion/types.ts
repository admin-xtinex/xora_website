import type { ComponentType } from 'react';
import type { Fixture, JsonObject, SceneDefinition } from '@futures-edge/contracts';

/** Every scene renderer is a pure function of its parameters and the scene progress p ∈ [0, 1]. */
export interface SceneProps {
  params: JsonObject;
  p: number;
  fixture?: Fixture;
}

export type SceneRenderer = ComponentType<SceneProps>;
export type SceneDef = SceneDefinition<SceneRenderer>;
