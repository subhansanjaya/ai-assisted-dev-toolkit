import { extractInput } from "../utils/input.js";

type MCPTextContent = {
  type: "text";
  text: string;
};

type MCPResponse = {
  content: MCPTextContent[];
  _meta: { filePath?: string };
};

export function createToolHandler(schema: any, handler: any, fixer?: any) {
  return async (extra: any): Promise<MCPResponse> => {
    const raw = extractInput(extra);
    const fixed = fixer ? fixer(raw) : raw;

    const parsed = schema.safeParse(fixed);

    // Validation failed
    if (!parsed.success) {
      return {
        content: [
          {
            type: "text",
            text:
              "Validation failed:\n" +
              JSON.stringify(parsed.error.format(), null, 2),
          },
        ],
        _meta: {}, // ALWAYS return _meta
      };
    }

    const result = await handler(parsed.data);

    // Success
    return {
      content: [
        {
          type: "text",
          text: String(result.content), // ensure string
        },
      ],
      _meta: { filePath: result.filePath },
    };
  };
}