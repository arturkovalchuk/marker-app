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