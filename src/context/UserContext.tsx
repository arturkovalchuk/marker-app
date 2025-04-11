import React, { createContext, useContext, useReducer } from 'react';
import { User, UserState, Visit } from '../types';

type Action =
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: Partial<User> & { id: string } }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'ADD_TAG'; payload: { userId: string; tag: string } }
  | { type: 'REMOVE_TAG'; payload: { userId: string; tag: string } };

// Sample data for demonstration
const sampleVisits: Visit[] = [
  { id: '1', date: '2023-12-01T14:30:00Z', service: 'Consultation', amount: 50.00 },
  { id: '2', date: '2023-12-15T10:00:00Z', service: 'Treatment', amount: 120.00 },
  { id: '3', date: '2024-01-05T16:45:00Z', service: 'Follow-up', amount: 75.00 },
  { id: '4', date: '2024-01-20T09:15:00Z', service: 'Treatment', amount: 120.00 },
  { id: '5', date: '2024-02-10T11:30:00Z', service: 'Consultation', amount: 50.00 },
];

const sampleUsers: User[] = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (234) 567-8901',
    registrationDate: '2023-10-15T08:30:00Z',
    notes: 'Prefers appointments in the afternoon. Allergic to peanuts.',
    tags: ['loyal', 'premium', 'new client'],
    visitHistory: sampleVisits,
  },
  {
    id: 'u2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (345) 678-9012',
    registrationDate: '2023-11-20T14:45:00Z',
    tags: ['regular'],
    visitHistory: sampleVisits.slice(0, 2),
  },
];

const initialState: UserState = {
  users: sampleUsers,
  tags: new Set(['loyal', 'premium', 'new client', 'regular']),
};

function userReducer(state: UserState, action: Action): UserState {
  switch (action.type) {
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload],
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id 
            ? { ...user, ...action.payload } 
            : user
        ),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      };
    case 'ADD_TAG': {
      const updatedUsers = state.users.map((user) =>
        user.id === action.payload.userId && !user.tags.includes(action.payload.tag)
          ? { ...user, tags: [...user.tags, action.payload.tag] }
          : user
      );
      const newTags = new Set(state.tags);
      newTags.add(action.payload.tag);
      return {
        users: updatedUsers,
        tags: newTags,
      };
    }
    case 'REMOVE_TAG': {
      const updatedUsers = state.users.map((user) =>
        user.id === action.payload.userId
          ? { ...user, tags: user.tags.filter((tag) => tag !== action.payload.tag) }
          : user
      );
      return {
        ...state,
        users: updatedUsers,
      };
    }
    default:
      return state;
  }
}

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}