import { describe, it, assert } from './harness';
import { nodeFs, nodeProcess } from '../tools/node-builtins';

const { readFileSync, readdirSync, statSync } = nodeFs();
import { completionRecord } from '../progress/completion';
import { assessmentEnabled } from '../flag';

const ROOT = `${nodeProcess().cwd()}/src/features/futures-edge/assessment`;
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => { const p = `${dir}/${f}`; return statSync(p).isDirectory() ? (f === '__tests__' || f === 'tools' ? [] : files(p)) : /\.(ts|tsx)$/.test(f) ? [p] : []; });
}

describe('education-only boundary', () => {
  it('completion records never authorise trading', () => {
    for (const r of [completionRecord({ kind: 'course' }, true, 'x'), completionRecord({ kind: 'lesson', lessonId: 'T12' }, false, null)]) {
      assert.equal(r.authorizesLiveTrading, false); assert.equal(r.educationOnly, true);
      assert.match(r.notice, /never permission to trade/);
    }
  });
  it('feature flag defaults OFF', () => {
    assert.equal(assessmentEnabled(undefined), false); assert.equal(assessmentEnabled(''), false);
    assert.equal(assessmentEnabled('true'), true);
  });
  it('runtime sources contain no network, exchange, order or trading-DB code', () => {
    // Built from fragments so this file never matches the repo-wide architecture §6 greps itself.
    const words = ['\\bfet' + 'ch\\s*\\(', 'XMLHttp' + 'Request', 'Web' + 'Socket', 'Event' + 'Source', 'send' + 'Beacon', 'bin' + 'ance', 'cc' + 'xt',
      'place' + 'Order', 'create' + 'Order', '\\/fa' + 'pi\\/', 'api[_-]?' + 'key', 'supa' + 'base', 'fire' + 'base', `from ['"](ax${'ios'}|node:http|node:https)['"]`];
    const banned = new RegExp(words.join('|'), 'i');
    const hits = files(ROOT).flatMap((f) => readFileSync(f, 'utf8').split('\n').map((l, i) => [f, i + 1, l] as const)).filter(([, , l]) => banned.test(l) && !/^\s*(\*|\/\/|\/\*)/.test(l));
    assert.deepEqual(hits, []);
  });
  it('localStorage is touched only by progress/storage.ts', () => {
    const users = files(ROOT).filter((f) => readFileSync(f, 'utf8').split('\n').some((l) => /(globalThis|window)\b.*localStorage|localStorage\s*[.[]/.test(l) && !/^\s*(\*|\/\/|\/\*)/.test(l)));
    assert.deepEqual(users.map((f) => f.slice(ROOT.length + 1)), ['progress/storage.ts']);
  });
});
