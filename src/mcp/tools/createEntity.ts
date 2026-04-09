// src/mcp/tools/createEntity.ts
import fs from "fs";
import path from "path";
import { loadTemplate, renderTemplate } from "../services/templateService.ts";

export async function createEntity(input: any) {
  const outputDir = path.join(process.cwd(), "output");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const fileName = `${input.entityName}.entity`;
  const filePath = path.join(outputDir, fileName);

  const template = loadTemplate("entity.tpl");

  const fieldsContent = input.fields
    .map((f: any) => `  ${f.name} : ${f.type};`)
    .join("\n");

  const content = renderTemplate(template, {
    entityName: input.entityName,
    fields: fieldsContent,
  });

  fs.writeFileSync(filePath, content, "utf-8");

  return {
    filePath,
    absFilePath: filePath,
    content,
    _ai: {
      guidance: [
        `Generated entity: ${input.entityName}`,
        `Fields: ${input.fields.map((f: any) => f.name).join(", ")}`,
      ],
    },
  };
}