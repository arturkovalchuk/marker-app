import React, { createContext, useContext, useReducer } from 'react';
import type { User, UserState } from '../types';

interface UserContextType {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  getUserById: (userId: string) => User | undefined;
}

type UserAction =
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: { id: string; [key: string]: unknown } }
  | { type: 'ADD_TAG'; payload: { userId: string; tag: string } }
  | { type: 'REMOVE_TAG'; payload: { userId: string; tag: string } }
  | { type: 'DELETE_USER'; payload: { id: string } };

const initialState: UserState = {
  users: [
    {
      id: 'USR001',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      registrationDate: '2024-01-15T10:00:00Z',
      notes: 'Regular customer, prefers morning appointments',
      tags: ['VIP', 'Regular'],
      visitHistory: [
        { id: 'V1', date: '2024-02-01T14:30:00Z', service: 'Consultation', amount: 50 },
        { id: 'V2', date: '2024-02-15T16:00:00Z', service: 'Treatment', amount: 120 },
        { id: 'V3', date: '2024-02-28T11:00:00Z', service: 'Therapy', amount: 85 },
        { id: 'V4', date: '2024-03-05T09:30:00Z', service: 'Treatment', amount: 150 },
        { id: 'V5', date: '2024-03-15T15:00:00Z', service: 'Checkup', amount: 75 },
      ],
    },
    {
      id: 'USR002',
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1987654321',
      registrationDate: '2024-01-20T11:00:00Z',
      notes: 'New customer, interested in premium services',
      tags: ['New', 'Premium'],
      visitHistory: [
        { id: 'V6', date: '2024-02-10T13:00:00Z', service: 'Consultation', amount: 50 },
        { id: 'V7', date: '2024-02-20T14:00:00Z', service: 'Premium Treatment', amount: 200 },
        { id: 'V8', date: '2024-03-01T16:30:00Z', service: 'Therapy', amount: 95 },
      ],
    },
    {
      id: 'USR003',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1122334455',
      registrationDate: '2024-01-25T09:00:00Z',
      notes: 'Student discount applied',
      tags: ['Student', 'Regular'],
      visitHistory: [
        { id: 'V9', date: '2024-02-05T11:00:00Z', service: 'Student Consultation', amount: 35 },
        { id: 'V10', date: '2024-02-25T10:00:00Z', service: 'Treatment', amount: 90 },
        { id: 'V11', date: '2024-03-10T13:30:00Z', service: 'Checkup', amount: 45 },
        { id: 'V12', date: '2024-03-20T15:00:00Z', service: 'Therapy', amount: 70 },
      ],
    },
  ],
  tags: new Set(['VIP', 'Regular', 'New', 'Premium', 'Student']),
};

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload],
        tags: new Set([...state.tags, ...action.payload.tags]),
      };
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? { ...user, ...action.payload } : user
        ),
      };
    case 'ADD_TAG':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? {
                ...user,
                tags: user.tags.includes(action.payload.tag)
                  ? user.tags
                  : [...user.tags, action.payload.tag],
              }
            : user
        ),
        tags: new Set([...state.tags, action.payload.tag]),
      };
    case 'REMOVE_TAG':
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.userId
            ? { ...user, tags: user.tags.filter(tag => tag !== action.payload.tag) }
            : user
        ),
      };
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload.id),
      };
    default:
      return state;
  }
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const getUserById = (userId: string) => {
    return state.users.find(user => user.id === userId);
  };

  return (
    <UserContext.Provider value={{ state, dispatch, getUserById }}>{children}</UserContext.Provider>
  );
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
}
