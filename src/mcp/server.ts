// src/mcp/server.ts
import express from 'express';
import bodyParser from 'body-parser';
import { createProjection } from './tools/createProjection.js';
import { createPage } from './tools/createPage.js';
import { createEntity } from './tools/createEntity.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Minimal health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'MCP server' });
});

// Endpoint to create a projection
app.post('/projection', async (req, res) => {
  try {
    const { projectionName, entity, entityset } = req.body;
    if (!projectionName || !entity || !entityset) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await createProjection({ projectionName, entity, entityset });
    res.json({ success: true, filePath: result.filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create projection' });
  }
});

// Endpoint to create an entity
app.post('/entity', async (req, res) => {
  try {
    const { entityName, fields } = req.body;
    if (!entityName || !fields) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await createEntity({ entityName, fields });
    res.json({ success: true, filePath: result.filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create entity' });
  }
});

// Endpoint to create a client page
app.post('/page', async (req, res) => {
  try {
    const { pageName, entityset, label, listName } = req.body;
    if (!pageName || !entityset || !label || !listName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await createPage({ pageName, entityset, label, listName });
    res.json({ success: true, filePath: result.filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create page' });
  }
});

app.listen(PORT, () => {
  console.log(`MCP server running on http://localhost:${PORT}`);
});