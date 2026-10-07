import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const isCalendarDate = (value: string): boolean => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  if (year < 1 || month < 1 || month > 12 || day < 1) return false

  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  return day <= daysInMonth[month - 1]
}

const titleField = z.string().refine((value) => value.trim().length > 0, {
  message: 'Title must not be empty',
})

const calendarDateField = z.string().refine(isCalendarDate, {
  message: 'Expected a real calendar date in YYYY-MM-DD format',
})

const readingSchema = z.object({
  title: titleField,
  date: calendarDateField,
  tags: z.array(z.string()),
  slug: z.string().optional(),
  description: z.string().optional(),
  enableComment: z.boolean().optional(),
})

const pageSchema = z.object({
  title: titleField,
  date: calendarDateField.optional(),
  description: z.string().optional(),
  enableComment: z.boolean().optional(),
})

const post = defineCollection({
  loader: glob({
    base: './content/posts',
    pattern: ['**/*.{md,mdx}', '!index.mdx'],
    generateId: ({ entry }) => entry.replace(/\.mdx?$/u, ''),
  }),
  schema: readingSchema,
})

const markdownFixture = defineCollection({
  loader: glob({
    base: './fixtures/content',
    pattern: '*.{md,mdx}',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/u, ''),
  }),
  schema: readingSchema,
})

const page = defineCollection({
  loader: glob({
    base: './content',
    pattern: 'colophon.{md,mdx}',
    generateId: ({ entry }) => entry.replace(/\.mdx?$/u, ''),
  }),
  schema: pageSchema,
})

export const collections = { post, page, markdownFixture }
