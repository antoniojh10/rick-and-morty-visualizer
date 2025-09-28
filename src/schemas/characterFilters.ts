import { z } from 'zod';

export const statuses = ['Alive', 'Dead', 'unknown'] as const;
export type Status = (typeof statuses)[number];

export const sortOrders = ['none', 'az', 'za'] as const;
export type SortOrder = (typeof sortOrders)[number];

export const characterFiltersSchema = z.object({
  name: z.string().min(0).default(''),
  status: z.enum(['', ...statuses]).default(''),
  sort: z.enum(sortOrders).default('none'),
});

// Form schema with optional fields for the form component
export const characterFiltersFormSchema = z.object({
  name: z.string().min(0).optional(),
  status: z.enum(['', ...statuses]).optional(),
  sort: z.enum(sortOrders).optional(),
});

export type CharacterFilters = z.infer<typeof characterFiltersSchema>;
export type CharacterFiltersForm = z.infer<typeof characterFiltersFormSchema>;
