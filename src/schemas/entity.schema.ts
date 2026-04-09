import { z } from "zod";

export const entitySchema = z.object({
  entityName: z.string().min(1),
  fields: z.array(
    z.object({
      name: z.string().min(1),
      type: z.string().min(1),
    })
  ).min(1),
});