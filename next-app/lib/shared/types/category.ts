import { z } from 'zod'

export const categorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable(),
})

export type Category = z.infer<typeof categorySchema>
