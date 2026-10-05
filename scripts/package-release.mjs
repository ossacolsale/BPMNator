import { createHash } from 'node:crypto';
import { appendFileSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const outputDir = join(root, '.release');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const tag = process.env.RELEASE_TAG;

if (tag && tag !== `v${pkg.version}`) {
  throw new Error(`Release tag ${tag} does not match package version ${pkg.version}`);
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

const npmCache = join(tmpdir(), `bpmnator-npm-cache-${process.pid}`);
const packed = spawnSync('npm', ['pack', '--pack-destination', outputDir], {
  cwd: root,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'inherit'],
  env: { ...process.env, npm_config_cache: npmCache }
});
rmSync(npmCache, { recursive: true, force: true });
if (packed.status !== 0) throw new Error('npm pack failed');

const archive = join(outputDir, `${pkg.name}-${pkg.version}.tgz`);
if (!statSync(archive, { throwIfNoEntry: false })) throw new Error('npm pack did not create the expected archive');
const listing = spawnSync('tar', ['-tzf', archive], { encoding: 'utf8' });
if (listing.status !== 0) throw new Error('Package archive is corrupt or truncated');

const files = new Set(listing.stdout.trim().split('\n'));
const required = [
  'package/package.json',
  'package/README.md',
  'package/LICENSE',
  'package/dist/bin/bpmnator.js',
  'package/dist/bin/bpmnator.d.ts'
];
for (const file of required) {
  if (!files.has(file)) throw new Error(`Package archive is missing required file: ${file}`);
}

const prohibited = /(^|\/)(\.git|\.release|node_modules|test|tests|examples)(\/|$)|(^|\/)(\.env[^/]*|[^/]*\.(pem|key))$/i;
for (const file of files) {
  if (prohibited.test(file)) throw new Error(`Package archive includes prohibited file: ${file}`);
}

const manifest = spawnSync('tar', ['-xOf', archive, 'package/package.json'], { encoding: 'utf8' });
if (manifest.status !== 0) throw new Error('Could not read package metadata from archive');
const packedPkg = JSON.parse(manifest.stdout);
if (packedPkg.name !== pkg.name || packedPkg.version !== pkg.version) {
  throw new Error('Packaged name/version does not match the repository manifest');
}

const digest = createHash('sha256').update(readFileSync(archive)).digest('hex');
const checksum = `${digest}  ${basename(archive)}\n`;
writeFileSync(`${archive}.sha256`, checksum);
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `archive=${basename(archive)}\n`);
}
console.log(`Validated ${basename(archive)} (${statSync(archive).size} bytes)`);
