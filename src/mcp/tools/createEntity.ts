import fs from 'fs';
import path from 'path';

// -------------------- Types --------------------
export interface EntityInput {
  entityName: string;
  fields: { name: string; type: string }[];
}

export interface EntityOutput {
  filePath: string;
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
export async function createEntity(input: EntityInput): Promise<EntityOutput> {
  // Output folder (ensure it exists)
  const outputDir = path.join(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const fileName = `${input.entityName}.entity`;
  const filePath = path.join(outputDir, fileName);

  // Template file path (use process.cwd() so Jest can find it)
  const templatePath = path.join(process.cwd(), 'src/mcp/templates/entity.tpl');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found at ${templatePath}`);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');

  // Generate fields content
  const fieldsContent = input.fields
    .map(f => `  ${f.name} : ${f.type};`)
    .join('\n');

  // Render template
  const content = renderTemplateString(template, {
    entityName: input.entityName,
    fields: fieldsContent,
  });

  // Write entity file
  fs.writeFileSync(filePath, content, 'utf-8');

  return { filePath, content };
}