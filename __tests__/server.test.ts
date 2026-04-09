import fs from 'fs';
import { createProjection } from '../src/mcp/tools/createProjection';
import { createPage } from '../src/mcp/tools/createPage';


import { cleanOutputDir } from './testUtils';

const outputDir = 'output';

beforeAll(() => cleanOutputDir(outputDir));
afterAll(() => cleanOutputDir(outputDir));

describe('MCP server orchestration', () => {
  it('creates projection and page in correct order', async () => {
    const proj = await createProjection({ projectionName: 'TestProj', entity: 'CustomerOrder', entitySet: 'CustomerOrders' });
    const page = await createPage({ pageName: 'CustOrdOverview', entitySet: 'CustomerOrders', label: 'Customer Orders', listName: 'CustOrdList' });

    expect(proj.content).toContain('projection TestProj;');
    expect(page.content).toContain('page CustOrdOverview using CustomerOrders {');
    expect(fs.existsSync(proj.filePath)).toBe(true);
    expect(fs.existsSync(page.filePath)).toBe(true);
  });
});