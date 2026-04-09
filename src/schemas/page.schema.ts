import { z } from "zod";

export const pageSchema = z.object({
  pageName: z.string().min(1),
  entitySet: z.string().min(1),
  label: z.string().min(1),
  listName: z.string().min(1),
});