# Vendored 1.x backport of image-size

Local backport for use as a git submodule / npm workspace (`vendor/image-size`). Needed because Metro 0.83–0.86
(Expo SDK 54) depends on `image-size ^1.0.2` and the patched 2.x line is not drop-in (Metro's bundling fails with
`The "list" argument must be an instance of SharedArrayBuffer, ArrayBuffer or ArrayBufferView`). Upstream fixed the
advisories only on 2.x (2.0.3, 2.0.4); the `v1.x` branch (1.2.1) has no fix.

| | |
|---|---|
| Base | `v1.x` branch tip, 1.2.1 (canonical upstream: https://codeberg.org/image-size/image-size) |
| Fork version | 1.2.2 |
| Advisories | GHSA-5p2g-fcmc-qvqq (JXL/HEIF DoS, >=1.2.0 <=2.0.2), GHSA-w3rx-r6r6-pgpr (ICNS DoS, >=0.6.3 <=2.0.2) |
| Source | Hand-ported from upstream 2.x commit `e6e83a5` (`git cherry-pick` conflicts in 6 files: the 1.x tree differs) |
| `lib/types/utils.ts` | `findBox` rewritten to always advance; boxes smaller than their 8-byte header are skipped |
| `lib/types/jxl.ts` | `jxlp` box < 12 bytes → `TypeError('Invalid JXL')` (zero-size box looped forever); missing codestream → `TypeError('Invalid JXL')` |
| `lib/types/icns.ts` | entry shorter than the 8-byte header → `TypeError('Invalid ICNS')` (zero length looped forever); header read bounds-checked |
| `lib/types/heif.ts` | `ispe` box < 20 bytes → `TypeError('Invalid HEIF')` |
| Not ported | upstream's multi-image HEIF loop and `clap` handling (do not exist in 1.x); ICO image-count check (`8fec406`, not part of either advisory); `!` → `?.` lint changes |
| Tests | 3 upstream malformed samples added to `specs/images/invalid/` (the existing invalid spec checks every file there for `TypeError /^Invalid \w+$/`) |
| Results | Stock: ICNS sample hangs, JXL throws a plain `Error`, HEIF returns a bogus size. Fork: all three throw the expected `TypeError`. 101 existing specs pass on stock and fork; 107 with the new samples. |
| `dist/` | Built with `tsc` and **committed** (upstream builds on publish; a submodule has no build step). Rebuild after any `lib/` change. |
| `package.json` | devDependencies removed so a workspace install stays lean. To run the specs: `npm i --no-save --ignore-scripts mocha@11 ts-node chai@4 glob@10 sinon@17 typescript@5.4 @types/{node,mocha,chai,sinon,glob} queue` then `npx mocha` (mocha 10.2 does not run on Node 26). |

## Retire this fork when
the consumer moves to Metro >= 0.87 (it dropped `image-size` for its own `lib/imageSize`; current `react-native`
depends on `metro ^0.87`), or a patched 1.x is published. Then drop the submodule, remove it from `workspaces`,
delete the lock entry, `npm install`, confirm `npm audit` is 0.

Submission policy: **do not submit this upstream** — Codeberg forbids AI-authored contributions. Review and any
upstream contact are the owner's call.
