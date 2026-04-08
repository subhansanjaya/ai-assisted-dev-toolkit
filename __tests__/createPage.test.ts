import fs from 'fs';
import path from 'path';
import { createPage } from '../src/mcp/tools/createPage';
import { cleanOutputDir } from './testUtils';

const outputDir = 'output';

beforeAll(() => cleanOutputDir(outputDir));
afterAll(() => cleanOutputDir(outputDir));

describe('createPage', () => {
  it('creates client page with correct bindings', async () => {
    const input = {
      pageName: 'CustOrdOverview',
      entityset: 'CustomerOrders',
      label: 'Customer Orders',
      listName: 'CustOrdList'
    };

    const result = await createPage(input);

    // Jest-friendly path
    expect(result.filePath).toBe(path.join(outputDir, 'CustOrdOverview.client'));
    expect(result.content).toContain('page CustOrdOverview using CustomerOrders {');
    expect(result.content).toContain('list CustOrdList;');
    expect(fs.existsSync(result.absFilePath)).toBe(true); // absolute path used to check file
  });
});