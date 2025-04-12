declare global {
  // Add any global types here
  interface Window {
    // Add any window-specific types
  }
}

// Common types used across the application
export type SortDirection = 'asc' | 'desc';

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
}

// Ensure this is treated as a module
export {};
