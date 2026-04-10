# AI-Assisted IFS Marble Dev Toolkit (MCP Server)

## Overview

This project is a **basic Model Context Protocol (MCP) server** built with TypeScript to generate **IFS Marble / Aurena artifacts** such as:

- Projections  
- Pages  
- Entities (extensible)

It was created as an experiment to improve AI-assisted development for IFS Marble, including AI guidance, validation, and normalization.

![screenshot](https://github.com/subhansanjaya/ai-assisted-dev-toolkit/blob/main/assets/capture.png)

![screenshot](https://github.com/subhansanjaya/ai-assisted-dev-toolkit/blob/main/assets/capture-cursor.png)

![screenshot](https://github.com/subhansanjaya/ai-assisted-dev-toolkit/blob/main/assets/capture-cursor-2.png)

---

## Problem

When using AI tools (Cursor, Copilot):

- They don’t understand IFS Marble well  
- You must repeatedly provide examples  
- Generated code can be inconsistent  
- No validation or correction support  

---

## Solution

An MCP server that can connect to a custom source of programming patterns and generate validated IFS Marble artifacts:

- Generates Marble code using tools
- Provides consistent outputs
- Supports normalization of input from MCP Inspector
- Adds auto-fixes for missing fields (like page labels or list names)
- Integrates AI guidance for Cursor

---

## Project Structure

```
src/
  mcp/
    servermcp.ts      → MCP server (for Cursor / AI tools)
    server.ts         → Express server (for manual HTTP testing)
    tools/
      createProjection.ts
      createPage.ts
      createEntity.ts
    services/
      toolHandler.ts
      templateService.ts
  schemas/
    entity.schema.ts
    page.schema.ts
    projection.schema.ts

__tests__/
templates/ (optional)
```

---
## Cursor Integration

Checkout to the repository

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
Go to Cursor Settings -> Tools and MCPs

Enable the server (IFS Marble)

Restart Cursor and use:

```
Create a projection for CustomerOrder

or

Create an entity called Customer with fields:
- name (string)
- age (number)
- email (string)
```

---

## MCP Inspector

Run:
```bash
npm install
```

```bash
npx @modelcontextprotocol/inspector \
node --loader ts-node/esm src/mcp/servermcp.ts
```

Open:

```
http://localhost:6274
```

## Running

### MCP Server

```bash
npm install
```

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

- This is a basic prototype for AI-assisted development
- Works with MCP Inspector and Cursor
- Not production-ready yet
- Can be extended for validation, normalization, and fixes

---

## Summary

Instead of only prompting AI, this approach:

- Centralizes logic  
- Improves consistency  
- Can evolve into validation + correction system