import type { Profile, UserRole } from './types';

// ============================================
// MOCK USERS DATA
// Replace these with API calls to your backend
// ============================================

export const mockProfile: Profile = {
  id: 'mock-user-id',
  full_name: 'Ahmed Promoteur',
  email: 'ahmed@promoteur.com',
  company_name: 'Promoteur Immobilier SA',
  phone: '+212 5 22 33 44 55',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-06-01T00:00:00Z',
};

export const mockUserRole: UserRole = {
  id: 'role-1',
  user_id: 'mock-user-id',
  role: 'pro',
  created_at: '2024-01-01T00:00:00Z',
};

// Mock user for development - simulates an authenticated user
export const mockUser = {
  id: 'mock-user-id',
  email: 'ahmed@promoteur.com',
  created_at: '2024-01-01T00:00:00Z',
};
