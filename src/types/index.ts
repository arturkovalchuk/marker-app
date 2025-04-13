export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  registrationDate?: string;
  notes?: string;
  tags: string[];
  visitHistory: Visit[];
}

export interface Visit {
  id: string;
  date: string;
  service: string;
  amount: number;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  tags: Set<string>;
}

export interface FilterConfig {
  searchQuery: string;
  selectedTags: string[];
}

export interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}
