import { describe, it, assert } from './harness';
import { sha256Hex, canonicalJson } from '../engine/hash';
import { seededShuffle } from '../engine/shuffle';

describe('sha256 (pure TS) matches FIPS 180-2 vectors', () => {
  it('empty, abc, 448-bit message, unicode', () => {
    assert.equal(sha256Hex(''), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
    assert.equal(sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    assert.equal(sha256Hex('abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq'), '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1');
    assert.equal(sha256Hex('a'.repeat(1000)), '41edece42d63e8d9bf515a9ba6932e1c20cbc9f5a5d134645adb5db1b9737ea3');
    assert.equal(sha256Hex('≈ 1,810 USDT − ✓'), sha256Hex('≈ 1,810 USDT − ✓'));
    assert.notEqual(sha256Hex('≈'), sha256Hex('~'));
  });
  it('canonicalJson ignores key order and drops undefined', () => {
    assert.equal(canonicalJson({ b: 1, a: { d: 2, c: [1, { y: 1, x: 2 }] }, u: undefined }), '{"a":{"c":[1,{"x":2,"y":1}],"d":2},"b":1}');
  });
});

describe('seeded shuffle', () => {
  it('is deterministic per seed and a permutation', () => {
    const ids = ['a', 'b', 'c', 'd', 'e', 'f'];
    const s1 = seededShuffle(ids, 'seed-1');
    assert.deepEqual(seededShuffle(ids, 'seed-1'), s1);
    assert.deepEqual([...s1].sort(), ids);
    const variants = new Set(['s1', 's2', 's3', 's4', 's5', 's6'].map((s) => seededShuffle(ids, s).join('')));
    assert.ok(variants.size > 1, 'different seeds give different orders');
    assert.deepEqual(ids, ['a', 'b', 'c', 'd', 'e', 'f'], 'input not mutated');
  });
});
