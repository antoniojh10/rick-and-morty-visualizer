'use client';

import { useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { Search, Filter, ArrowUpAZ, ArrowDownAZ } from 'lucide-react';
import {
  characterFiltersFormSchema,
  type CharacterFilters,
  type CharacterFiltersForm,
  statuses,
  sortOrders,
} from '@/schemas/characterFilters';

interface CharacterFiltersProps {
  value?: Partial<CharacterFilters>;
  onChange: (filters: CharacterFilters) => void;
}

export default function CharacterFilters({ value = {}, onChange }: CharacterFiltersProps) {
  const { control, watch, getValues } = useForm<CharacterFiltersForm>({
    defaultValues: {
      name: '',
      status: '',
      sort: 'none',
      ...value,
    },
    resolver: zodResolver(characterFiltersFormSchema),
    mode: 'onChange',
  });

  // Track the latest onChange in a ref to avoid unnecessary effect re-runs
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Watch for form changes and submit them directly
  // The parent component will handle debouncing and validation
  useEffect(() => {
    const subscription = watch(values => {
      onChangeRef.current({
        name: values.name ?? '',
        status: values.status ?? '',
        sort: values.sort ?? 'none',
      });
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const values = getValues();

    // Always submit the form, let the parent handle validation
    onChange({
      name: values.name ?? '',
      status: values.status ?? '',
      sort: values.sort ?? 'none',
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-foreground/50" />
            </div>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  id="name"
                  type="text"
                  placeholder="Search by name..."
                  className="pl-10 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                />
              )}
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-4 w-4 text-foreground/50" />
            </div>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="status"
                  className="pl-10 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <option value="">All Status</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>

        <div>
          <label htmlFor="sort" className="block text-sm font-medium mb-1">
            Sort
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {watch('sort') === 'az' ? (
                <ArrowUpAZ className="h-4 w-4 text-foreground/50" />
              ) : watch('sort') === 'za' ? (
                <ArrowDownAZ className="h-4 w-4 text-foreground/50" />
              ) : (
                <Filter className="h-4 w-4 text-foreground/50" />
              )}
            </div>
            <Controller
              name="sort"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  id="sort"
                  className="pl-10 w-full rounded-md border border-foreground/20 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  {sortOrders.map(order => (
                    <option key={order} value={order}>
                      {order === 'az' ? 'A to Z' : order === 'za' ? 'Z to A' : 'No sorting'}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
