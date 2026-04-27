import { copyFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const envExamplePath = resolve(projectRoot, '.env.example');
const envPath = resolve(projectRoot, '.env');

if (!existsSync(envExamplePath)) {
  console.error('Missing .env.example. Cannot initialize local setup.');
  process.exit(1);
}

if (!existsSync(envPath)) {
  copyFileSync(envExamplePath, envPath);
  console.log('Created .env from .env.example');
} else {
  console.log('.env already exists. Keeping the current local configuration.');
}

console.log('');
console.log('Next steps:');
console.log('1. docker compose up --build');
console.log('2. Open http://localhost:1337/admin');
console.log('3. Check http://localhost:1337/api/health');
console.log('');
console.log('Before modeling business entities, read docs/ENTITY_RELATIONSHIP_BLUEPRINT.md');
