export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  registrationDate?: string;
  notes?: string;
  tags: string[];
  visitHistory?: Visit[];
}

export interface Visit {
  id: string;
  date: string;
  service: string;
  amount?: number;
}

export interface UserState {
  users: User[];
  tags: Set<string>;
}

export type SortableUserFields = 'id' | 'name' | 'email' | 'phone' | 'lastVisit';

export interface SortConfig<T> {
  key: T extends User ? SortableUserFields : keyof T;
  direction: 'asc' | 'desc';
}

export type UserAction =
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'REMOVE_TAG'; payload: { userId: string; tag: string } };
