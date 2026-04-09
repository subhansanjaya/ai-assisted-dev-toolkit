// src/mcp/tools/createPage.ts
import fs from "fs";
import path from "path";
import { loadTemplate, renderTemplate } from "../services/templateService.ts";

export async function createPage(input: any) {
  const outputDir = path.join(process.cwd(), "output/pages");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const fileName = `${input.pageName}.client`;
  const filePath = path.join(outputDir, fileName);

  const template = loadTemplate("page.tpl");

  const content = renderTemplate(template, input);

  fs.writeFileSync(filePath, content, "utf-8");

  return {
    filePath,
    absFilePath: filePath,
    content,
    _ai: {
      guidance: [
        `Generated page: ${input.pageName}`,
        `Label: ${input.label ?? input.pageName}`,
        `List: ${input.listName ?? `${input.pageName}List`}`,
      ],
    },
  };
}