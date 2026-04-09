import { z } from "zod";

export const projectionSchema = z.object({
  projectionName: z.string().min(1),
  entity: z.string().min(1),
  entitySet: z.string().min(1),
  componentName: z.string().min(1),
});