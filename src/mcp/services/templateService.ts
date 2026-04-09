import fs from "fs";
import path from "path";

export function loadTemplate(name: string) {
  const templatePath = path.join(process.cwd(), `src/mcp/templates/${name}`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  return fs.readFileSync(templatePath, "utf-8");
}

export function renderTemplate(template: string, data: Record<string, string>) {
  let content = template;

  for (const key in data) {
    content = content.replace(new RegExp(`{{${key}}}`, "g"), data[key] ?? "");
  }

  return content;
}