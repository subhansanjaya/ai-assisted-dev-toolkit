// tools/createProjection.ts
import fs from 'fs';
import path from 'path';

// -------------------- Types --------------------
export interface ProjectionInput {
  projectionName: string;
  entity: string;
  entityset: string;
}

export interface ProjectionOutput {
  filePath: string;    // relative path for Jest
  absFilePath: string; // absolute path
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
export async function createProjection(input: ProjectionInput): Promise<ProjectionOutput> {
  // Output folder
  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const fileName = `${input.projectionName}.projection`;
  const absFilePath = path.join(outputDir, fileName);
  const relFilePath = path.relative(process.cwd(), absFilePath);

  // Load template from file
  const templatePath = path.join(process.cwd(), 'src/mcp/templates/projection.tpl');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found at ${templatePath}`);
  }
  const template = fs.readFileSync(templatePath, 'utf-8');

  // Render template
  const content = renderTemplateString(template, {
    projectionName: input.projectionName,
    entity: input.entity,
    entityset: input.entityset,
  });

  // Write projection file
  fs.writeFileSync(absFilePath, content, 'utf-8');

  return {
    filePath: relFilePath,
    absFilePath,
    content,
  };
}