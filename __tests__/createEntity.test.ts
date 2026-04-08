import { createEntity } from '../src/mcp/tools/createEntity';
import { cleanOutputDir } from './testUtils';

beforeAll(() => cleanOutputDir('output/entities'));
afterAll(() => cleanOutputDir('output/entities'));

describe('Entity generation', () => {
  it('creates an entity file correctly', async () => {
    const result = await createEntity({
      entityName: 'CustomerOrder',
      fields: [
        { name: 'OrderId', type: 'number' },
        { name: 'CustomerName', type: 'string' },
      ],
    });

    expect(result.content).toContain('entity CustomerOrder {');
    expect(result.content).toContain('OrderId : number;');
  });
});