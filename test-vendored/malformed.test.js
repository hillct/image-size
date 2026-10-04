'use strict';
// Plain-node regression tests against the built dist/ (see VENDORED.md).
// The full upstream mocha/ts-node suite lives in specs/ and needs dev deps.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { imageSize } = require('..');

const invalid = path.join(__dirname, '..', 'specs', 'images', 'invalid');
const read = (...p) => fs.readFileSync(path.join(__dirname, '..', 'specs', 'images', ...p));

for (const [file, message] of [
  ['heif-undersized-ispe.heic', 'Invalid HEIF'],
  ['icns-zero-length-entry.icns', 'Invalid ICNS'],
  ['jxl-header-only-jxlp.jxl', 'Invalid JXL'],
]) {
  test(`${file} is rejected with TypeError('${message}'), without hanging`, () => {
    assert.throws(
      () => imageSize(fs.readFileSync(path.join(invalid, file))),
      (e) => e instanceof TypeError && e.message === message,
    );
  });
}

test('a valid PNG still reports its dimensions', () => {
  assert.deepStrictEqual(imageSize(read('valid', 'png', 'sample.png')), { height: 456, width: 123, type: 'png' });
});

test('default export is callable (Metro uses interopRequireDefault(...).default)', () => {
  assert.strictEqual(typeof require('..').default, 'function');
});
