/** Renders authored ContentBlocks (shared by slides, notes and the review card). */
import type { AnimationScene, ContentBlock, Fixture, FixtureId } from '@futures-edge/contracts';
import { sceneRegistry } from '../motion/registry';
import { MiniChart } from '../exercises/MiniChart';
import { candlesOf, labelsOf, ticksOf } from '../motion/params';
import { RichText } from './RichText';
import { useGlossary } from './hooks';

export interface BlockCtx {
  scenes: AnimationScene[];
  getFixture: (id: FixtureId) => Fixture | undefined;
}

const CALLOUT_TITLES: Record<string, string> = {
  safety: 'Safety', tip: 'Tip', mistake: 'Common mistake', 'fictional-data': 'Fictional data', 'not-advice': 'Not advice', approximation: 'Approximation',
};

/** Final frame of a scene, used as a slide illustration (with its text description). */
export function SceneStill({ scene, ctx }: { scene: AnimationScene; ctx: BlockCtx }) {
  const R = sceneRegistry.get(scene.type)?.render;
  const fixture = scene.fixtureId ? ctx.getFixture(scene.fixtureId) : undefined;
  return (
    <figure className="fel-still">
      <div className="fel-stage fel-stage-still">{R ? <R params={scene.parameters} p={1} {...(fixture ? { fixture } : {})} /> : null}</div>
      <figcaption className="fel-small"><RichText text={scene.reducedMotionDescription} /></figcaption>
    </figure>
  );
}

export function FixtureFigure({ fixture, caption, alt }: { fixture: Fixture | undefined; caption: string; alt: string }) {
  const cs = candlesOf(fixture);
  const pts = ticksOf(fixture).map((t) => t.p);
  return (
    <figure className="fel-still">
      <div className="fel-stage fel-stage-still"><MiniChart candles={cs} points={cs.length ? [] : pts} labels={labelsOf(fixture)} label={alt} /></div>
      <figcaption className="fel-small"><RichText text={caption} /></figcaption>
    </figure>
  );
}

export function Blocks({ blocks, ctx }: { blocks: ContentBlock[]; ctx: BlockCtx }) {
  return <>{blocks.map((b, k) => <Block key={k} b={b} ctx={ctx} />)}</>;
}

function Block({ b, ctx }: { b: ContentBlock; ctx: BlockCtx }) {
  const { byId } = useGlossary();
  switch (b.kind) {
    case 'paragraph': return <p><RichText text={b.text} /></p>;
    case 'heading': return b.level === 3 ? <h3><RichText text={b.text} /></h3> : <h4><RichText text={b.text} /></h4>;
    case 'list': {
      const items = b.items.map((it, k) => <li key={k}><RichText text={it} /></li>);
      return b.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case 'definition': {
      const g = byId.get(b.termId);
      return (
        <dl className="fel-definition">
          <dt>{g?.term ?? b.termId}</dt>
          <dd><RichText text={b.text ?? g?.plainDefinition ?? ''} /></dd>
        </dl>
      );
    }
    case 'analogy': return <p className="fel-analogy"><span className="fel-analogy-tag">Everyday analogy</span> <RichText text={b.text} /></p>;
    case 'formula': return (
      <div className="fel-formula">
        <p className="fel-formula-expr"><code>{b.expression}</code></p>
        <ul className="fel-formula-vars">{b.variables.map((v, k) => <li key={k}><code>{v.symbol}</code>: <RichText text={v.meaning} /> <span className="fel-unit">[{v.unit}]</span></li>)}</ul>
        {b.note ? <p className="fel-small"><RichText text={b.note} /></p> : null}
      </div>
    );
    case 'worked-example': return (
      <div className="fel-worked">
        <p className="fel-worked-title"><RichText text={b.title} /> <span className="fel-badge-fictional">fictional</span></p>
        <ol>{b.steps.map((s, k) => <li key={k}><RichText text={s.text} />{s.result ? <> → <strong>{s.result}</strong></> : null}</li>)}</ol>
        <p><RichText text={b.conclusion} /></p>
      </div>
    );
    case 'callout': return (
      <aside className={`fel-callout fel-callout-${b.callout}`}>
        <p className="fel-callout-title">{b.title ? <RichText text={b.title} /> : CALLOUT_TITLES[b.callout]}</p>
        <p><RichText text={b.text} /></p>
      </aside>
    );
    case 'table': return (
      <div className="fel-table-wrap">
        <table className="fel-table">
          <caption><RichText text={b.caption} /></caption>
          <thead><tr>{b.headers.map((h, k) => <th key={k} scope="col"><RichText text={h} /></th>)}</tr></thead>
          <tbody>{b.rows.map((r, k) => <tr key={k}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row"><RichText text={c} /></th> : <td key={j}><RichText text={c} /></td>))}</tr>)}</tbody>
        </table>
      </div>
    );
    case 'comparison': return (
      <div className="fel-compare">
        {[b.left, b.right].map((side, k) => (
          <div key={k} className="fel-compare-col">
            <p className="fel-compare-title"><RichText text={side.title} /></p>
            <ul>{side.points.map((pt, j) => <li key={j}><RichText text={pt} /></li>)}</ul>
          </div>
        ))}
      </div>
    );
    case 'scene-embed': {
      const s = ctx.scenes.find((x) => x.id === b.sceneId);
      return s ? <SceneStill scene={s} ctx={ctx} /> : null;
    }
    case 'fixture-figure': return <FixtureFigure fixture={ctx.getFixture(b.fixtureId)} caption={b.caption} alt={b.textAlternative} />;
    case 'learn-more': return (
      <details className="fel-details">
        <summary><RichText text={b.title} /></summary>
        <Blocks blocks={b.blocks} ctx={ctx} />
      </details>
    );
  }
}
