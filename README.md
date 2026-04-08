# AI-Assisted IFS Marble Dev Toolkit (MCP Server)

## Overview

This project is a **basic Model Context Protocol (MCP) server** built with TypeScript to generate **IFS Marble / Aurena artifacts** such as:

- Projections  
- Pages  
- Entities (extensible)

It was created as an experiment to improve AI-assisted development for IFS Marble.

![screenshot](https://github.com/subhansanjaya/ai-assisted-dev-toolkit/blob/main/assets/capture.png)

---

## Problem

When using AI tools (Cursor, Copilot):

- They don’t understand IFS Marble well  
- You must repeatedly provide examples  
- Generated code can be inconsistent  
- No validation or correction support  

---

## Solution

an MCP server that can connect to a custom source of programming patterns

- Generates Marble code using tools  
- Provides consistent outputs  
- Can be extended for validation and fixes  
- Acts as a simple domain-specific backend  

---

## Project Structure

```
src/
  mcp/
    servermcp.ts → MCP server (for Cursor / AI tools)
    server.ts → Express server (for manual testing via HTTP)
    tools/
      createProjection.ts
      createPage.ts
      createEntity.ts

__tests__/
templates/ (optional)
```

---

## Installation

```bash
npm install
```

---

## Running

### MCP Server

```bash
node --loader ts-node/esm src/mcp/servermcp.ts 

or 

update package.json "scripts": {
    "dev": "node --loader ts-node/esm src/mcp/servermcp.ts", }
npm run dev
```

### Express Server

```bash
node --loader ts-node/esm src/mcp/server.ts 

or 

update package.json "scripts": {
    "dev": "node --loader ts-node/esm src/mcp/server.ts", }
npm run dev
```

---

## Testing (Jest)

Run tests:

```bash
npm test
```

Example test location:

```
__tests__/
```

---

## MCP Inspector

Run:

```bash
npx @modelcontextprotocol/inspector \
node --loader ts-node/esm src/mcp/servermcp.ts
```

Open:

```
http://localhost:6274
```

### Input Format (Important)

Inspector does NOT support JSON directly. Use key-value pairs:

| Key              | Value       |
|------------------|------------|
| entityName       | Customer   |
| fields_1_name    | customerId |
| fields_1_type    | string     |
| fields_2_name    | name       |
| fields_2_type    | string     |

---

## Cursor Integration

Create `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "ifs-marble": {
      "command": "node",
      "args": [
        "--loader",
        "ts-node/esm",
        "src/mcp/servermcp.ts"
      ]
    }
  }
}
```

Restart Cursor and use:

```
Create a projection for CustomerOrder
```

---

## Express API Example

```bash
curl -X POST http://localhost:3000/projection \
  -H "Content-Type: application/json" \
  -d '{"projectionName":"TestProj","entity":"CustomerOrder","entityset":"CustomerOrders"}'
```

---

## Documentation sources used as references for the implemented template patterns

https://docs.ifs.com/techdocs/23r2/060_development/022_user_interface/030_aurena_dev/100_how_to_develop_aurena_pages/020_create_a_simple_aurena_page/#add_the_page_to_the_navigator

---

## Templates (Optional)

You can use `.tpl` files:

```
templates/
  projection.tpl
  page.tpl
  entity.tpl

  can be extended to add client control patterns etc.
```

---

## Notes

- This is a basic prototype  
- Not production-ready  
- Can be extended further  

---

## Summary

Instead of only prompting AI, this approach:

- Centralizes logic  
- Improves consistency  
- Can evolve into validation + correction system