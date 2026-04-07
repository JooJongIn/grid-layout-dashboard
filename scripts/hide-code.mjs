import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const node = process.execPath;
const babelCli = join(root, 'node_modules', '@babel', 'cli', 'bin', 'babel.js');
const obfCli = join(root, 'node_modules', 'javascript-obfuscator', 'bin', 'javascript-obfuscator');

function processFile(jsxRel) {
  const absJsx = join(root, jsxRel);
  if (!existsSync(absJsx)) {
    console.error('Missing:', jsxRel);
    process.exit(1);
  }
  const jsRel = jsxRel.replace(/\.jsx$/i, '.js');
  console.log(`\n→ ${jsxRel}`);
  execFileSync(
    node,
    [babelCli, jsxRel, '--out-file', jsRel, '--presets=@babel/preset-react'],
    { cwd: root, stdio: 'inherit' }
  );
  execFileSync(node, [obfCli, jsRel, '--output', jsRel], { cwd: root, stdio: 'inherit' });
}

const targets = [
  'src/store.jsx',
  'src/pages/dashboard/card/card.jsx',
  'src/pages/dashboard/card/content.jsx',
];

const hookDir = join(root, 'src', 'hook');
for (const name of readdirSync(hookDir)) {
  if (name.endsWith('.jsx')) targets.push(`src/hook/${name}`);
}

targets.sort();

for (const jsx of targets) processFile(jsx);

console.log('\nhide-code: done.');
