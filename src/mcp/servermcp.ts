import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createProjection } from './tools/createProjection.js';
import { createPage } from './tools/createPage.js';
import { createEntity } from './tools/createEntity.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ESM-safe __dirname for this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log("Server running from directory:", __dirname);

// MCP Server instance
const server = new McpServer({
  name: 'ifs-marble-mcp',
  version: '1.0.0',
});

// ---------------------- createProjection ----------------------
server.registerTool(
  'createProjection',
  {
    title: 'Create Projection',
    description: 'Generate an IFS projection file with given entity and entity set',
  },
  async (extra) => {
    const meta = (extra as any)._meta || {};

    const projectionName = meta.projectionName;
    const entity = meta.entity;
    const entityset = meta.entityset;

    if (!projectionName || !entity || !entityset) {
      throw new Error(
        "Missing required fields (projectionName, entity, entityset) for projection. Received: " +
          JSON.stringify(meta, null, 2)
      );
    }

    const input = { projectionName, entity, entityset };
    const result = await createProjection(input);

    return {
      content: [{ type: 'text', text: result.content }],
      _meta: { filePath: result.filePath },
    };
  }
);

// ---------------------- createPage ----------------------
server.registerTool(
  'createPage',
  {
    title: 'Create Page',
    description: 'Generate an IFS Aurena client page with basic layout',
  },
  async (extra) => {
    const meta = (extra as any)._meta || {};

    const pageName = meta.pageName;
    const entityset = meta.entityset;
    const label = meta.label;
    const listName = meta.listName;

    if (!pageName || !entityset || !label || !listName) {
      throw new Error(
        "Missing required fields (pageName, entityset, label, listName) for page. Received: " +
          JSON.stringify(meta, null, 2)
      );
    }

    const input = { pageName, entityset, label, listName };
    const result = await createPage(input);

    return {
      content: [{ type: 'text', text: result.content }],
      _meta: { filePath: result.filePath },
    };
  }
);

// ---------------------- createEntity ----------------------
server.registerTool(
  'createEntity',
  {
    title: 'Create Entity',
    description: 'Generate an IFS entity with given fields',
  },
  async (extra) => {
    const meta = (extra as any)._meta || {};
    const entityName = meta.entityName;

    if (!entityName) {
      throw new Error(
        "Missing 'entityName' (optional: fields_1_name etc.). Payload received: " + JSON.stringify(extra, null, 2)
      );
    }

    // Reconstruct fields from _meta
    const fields = Object.keys(meta)
      .filter((k) => k.startsWith('fields_') && k.endsWith('_name'))
      .map((k) => {
        const idx = k.match(/fields_(\d+)_name/)![1];
        const typeKey = `fields_${idx}_type`;
        if (!meta[typeKey]) throw new Error(`Missing type for field index ${idx}`);
        return {
          name: meta[k],
          type: meta[typeKey],
        };
      });

    const entity = { entityName, fields };
    const result = await createEntity(entity);

    return {
      content: [{ type: 'text', text: result.content }],
      _meta: { filePath: result.filePath },
    };
  }
);

// ---------------------- main ----------------------
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();