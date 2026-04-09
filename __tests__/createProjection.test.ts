import fs from 'fs';
import path from 'path';
import { createProjection } from '../src/mcp/tools/createProjection';
import { cleanOutputDir } from './testUtils';

const outputDir = path.join(process.cwd(), "output");

beforeAll(() => cleanOutputDir(outputDir));
afterAll(() => cleanOutputDir(outputDir));

describe('createProjection', () => {
  it('creates projection file with correct content', async () => {
    const input = { 
      projectionName: 'TestProj', 
      entity: 'CustomerOrder', 
      entitySet: 'CustomerOrders' 
    };

    const result = await createProjection(input);

    // Use path.join to match OS-independent absolute path
    expect(result.filePath).toBe(path.join(outputDir, 'projections/TestProj.projection'));

    expect(result.content).toContain('projection TestProj;');
    expect(result.content).toContain('@DynamicComponentDependency CustomerOrder');
    expect(fs.existsSync(result.filePath)).toBe(true);
  });
});