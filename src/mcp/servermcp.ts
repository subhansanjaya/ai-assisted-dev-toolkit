// src/mcp/servermcp.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createEntity } from "./tools/createEntity.js";
import { createPage } from "./tools/createPage.js";
import { createProjection } from "./tools/createProjection.js";

import { createToolHandler } from "./services/toolHandler.js";
import { entitySchema } from "../schemas/entity.schema.js";
import { pageSchema } from "../schemas/page.schema.js";
import { projectionSchema } from "../schemas/projection.schema.js";

// -------------------- MCP Server --------------------
const server = new McpServer({
  name: "ifs-marble-mcp",
  version: "2.0.0",
});

// -------------------- Normalizers --------------------

// Normalize flat fields from MCP Inspector for entities
const normalizeEntityInput = (input: Record<string, any>) => {
  const fieldIndexes = Object.keys(input)
    .filter(k => k.startsWith("fields_") && k.endsWith("_name"))
    .map(k => parseInt(k.match(/fields_(\d+)_name/)![1]));

  const fields = fieldIndexes.map(idx => ({
    name: input[`fields_${idx}_name`],
    type: input[`fields_${idx}_type`] || "string",
  }));

  return { ...input, fields };
};

// Optional auto-fix for pages
const fixPage = (i: any) => ({
  ...i,
  label: i.label ?? i.pageName,
  listName: i.listName ?? `${i.pageName}List`,
});

// -------------------- Register Tools --------------------

// Entity
server.registerTool(
  "createEntity",
  { title: "Create Entity", description: "Generate an IFS entity" },
  createToolHandler(entitySchema, createEntity, normalizeEntityInput)
);

// Page
server.registerTool(
  "createPage",
  { title: "Create Page", description: "Generate an IFS Aurena page" },
  createToolHandler(pageSchema, createPage, fixPage)
);

// Projection
server.registerTool(
  "createProjection",
  { title: "Create Projection", description: "Generate an IFS projection" },
  createToolHandler(projectionSchema, createProjection)
);

// -------------------- Start Server --------------------
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();