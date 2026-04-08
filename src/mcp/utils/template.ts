import fs from 'fs';

export function renderTemplate(filePath: string, data: Record<string, string | undefined>): string {
  let content = fs.readFileSync(filePath, 'utf-8');

  for (const key in data) {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), data[key] ?? '');
  }

  return content;
}