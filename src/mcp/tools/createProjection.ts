// src/mcp/tools/createProjection.ts
import fs from "fs";
import path from "path";
import { loadTemplate, renderTemplate } from "../services/templateService.ts";

export async function createProjection(input: any) {
  const outputDir = path.join(process.cwd(), "output/projections");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const fileName = `${input.projectionName}.projection`;
  const filePath = path.join(outputDir, fileName);

  const template = loadTemplate("projection.tpl");

  const content = renderTemplate(template, {
    projectionName: input.projectionName,
    entity: input.entity,
    entitySet: input.entitySet,
    componentName: input.componentName,
    
  });

  fs.writeFileSync(filePath, content, "utf-8");

  return {
    filePath,
    absFilePath: filePath,
    content, 
    _ai: {
      guidance: [
        `Generated projection: ${input.projectionName}`,
        `Entity: ${input.entity}`,
        `Entity set: ${input.entitySet}`,
        `Component name: ${input.componentName}`,
      ],
    },
  };
}