// __tests__/testUtils.ts
import fs from 'fs';
import path from 'path';

export function cleanOutputDir(dir: string) {
  const fullPath = path.resolve(dir);

  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
  }

  fs.mkdirSync(fullPath, { recursive: true });
}