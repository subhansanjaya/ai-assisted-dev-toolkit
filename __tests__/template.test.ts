import fs from 'fs';
import { renderTemplate } from '../src/mcp/utils/template';
import { cleanOutputDir } from './testUtils';

const outputDir = 'output';

beforeAll(() => cleanOutputDir(outputDir));
afterAll(() => cleanOutputDir(outputDir));

describe('renderTemplate', () => {
  const templatePath = 'test-template.tpl';

  beforeAll(() => {
    fs.writeFileSync(templatePath, 'Hello {{name}}, your entity is {{entity}}!');
  });

  afterAll(() => {
    fs.unlinkSync(templatePath);
  });

  it('replaces template variables correctly', () => {
    const output = renderTemplate(templatePath, { name: 'Alice', entity: 'CustomerOrder' });
    expect(output).toBe('Hello Alice, your entity is CustomerOrder!');
  });

  it('defaults undefined variables to empty string', () => {
    const output = renderTemplate(templatePath, { name: undefined, entity: 'CustomerOrder' });
    expect(output).toBe('Hello , your entity is CustomerOrder!');
  });
});