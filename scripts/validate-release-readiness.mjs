import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const packagePath = path.join(root, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const scripts = packageJson.scripts ?? {};
const failures = [];

function requireField(condition, message) {
  if (!condition) failures.push(message);
}

requireField(packageJson.repository, 'package.json must declare repository metadata');
requireField(Array.isArray(packageJson.files) && packageJson.files.length > 0, 'package.json must declare a non-empty files allowlist');
requireField(scripts['package:smoke'], 'package.json scripts must include package:smoke');
requireField(scripts['release:check'], 'package.json scripts must include release:check');

const agentsPath = path.join(root, 'AGENTS.md');
requireField(fs.existsSync(agentsPath), 'repository must include AGENTS.md');

if (fs.existsSync(agentsPath)) {
  const agents = fs.readFileSync(agentsPath, 'utf8');
  const requiredProjectContext = {
    Repository: /github\.com\/rogerchappel\/ossmeter/,
    'Primary maintainer': /Roger Chappel/,
    'Default branch': /\bmain\b/,
    'Package manager': /\bnpm\b/,
  };

  for (const [label, expected] of Object.entries(requiredProjectContext)) {
    const line = agents.match(new RegExp(`^- ${label}:\\s*(.+)$`, 'm'))?.[1]?.trim();
    requireField(Boolean(line && line !== '``'), `AGENTS.md must declare a non-empty ${label} value`);
    if (line && line !== '``') {
      requireField(expected.test(line), `AGENTS.md ${label} must reference ${expected.source}`);
    }
  }

  requireField(
    /Branch from the latest `main` before editing\./.test(agents),
    'AGENTS.md branch policy must instruct contributors to branch from main',
  );
}

const workflowDir = path.join(root, '.github', 'workflows');
if (fs.existsSync(workflowDir)) {
  const workflowFiles = fs.readdirSync(workflowDir).filter((file) => /\.ya?ml$/.test(file));
  requireField(workflowFiles.length > 0, 'repository must include at least one workflow file');

  for (const file of workflowFiles) {
    const workflow = fs.readFileSync(path.join(workflowDir, file), 'utf8');
    requireField(!/TODO|FIXME|template becomes an app|customization TODO/i.test(workflow), '.github/workflows/' + file + ' still contains placeholder text');
  }

  const combined = workflowFiles.map((file) => fs.readFileSync(path.join(workflowDir, file), 'utf8')).join('\n');
  requireField(/release:check/.test(combined), 'CI workflows must run npm run release:check');
}

if (failures.length > 0) {
  console.error('Release readiness validation failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('Release readiness validation passed.');
