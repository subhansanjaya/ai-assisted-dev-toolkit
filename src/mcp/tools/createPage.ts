// tools/createPage.ts
import fs from 'fs';
import path from 'path';

// -------------------- Types --------------------
export interface PageInput {
  pageName: string;
  entityset: string;
  label: string;
  listName: string;
}

export interface PageOutput {
  filePath: string;    // relative path for Jest
  absFilePath: string; // absolute path for server
  content: string;
}

// -------------------- Template renderer --------------------
function renderTemplateString(template: string, data: Record<string, string>): string {
  let content = template;
  for (const key in data) {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), data[key] ?? '');
  }
  return content;
}

// -------------------- Main function --------------------
export async function createPage(input: PageInput): Promise<PageOutput> {
  // Output folder
  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const fileName = `${input.pageName}.client`;

  const absFilePath = path.join(outputDir, fileName);
  const relFilePath = path.relative(process.cwd(), absFilePath);

  // Load template from file (same pattern as createEntity)
  const templatePath = path.join(process.cwd(), 'src/mcp/templates/page.tpl');

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found at ${templatePath}`);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

  // Render template
  const content = renderTemplateString(template, {
    pageName: input.pageName,
    entityset: input.entityset,
    label: input.label,
    listName: input.listName,
  });

  // Write file
  fs.writeFileSync(absFilePath, content, 'utf-8');

  return {
    filePath: relFilePath,
    absFilePath,
    content,
  };
}