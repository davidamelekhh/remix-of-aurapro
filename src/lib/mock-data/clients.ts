import type { Client, ProjectClient } from './types';

// ============================================
// MOCK CLIENTS DATA
// Replace these with API calls to your backend
// ============================================

export const mockClients: Client[] = [
  {
    id: 'client-1',
    owner_id: 'mock-user-id',
    name: 'Mohammed Benali',
    email: 'mohammed.benali@example.com',
    phone: '+212 6 12 34 56 78',
    status: 'Actif',
    join_date: '2024-02-15',
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z',
  },
  {
    id: 'client-2',
    owner_id: 'mock-user-id',
    name: 'Fatima Zahra Alaoui',
    email: 'fatima.alaoui@example.com',
    phone: '+212 6 98 76 54 32',
    status: 'Actif',
    join_date: '2024-03-20',
    created_at: '2024-03-20T00:00:00Z',
    updated_at: '2024-03-20T00:00:00Z',
  },
  {
    id: 'client-3',
    owner_id: 'mock-user-id',
    name: 'Karim El Mansouri',
    email: 'karim.mansouri@example.com',
    phone: '+212 6 55 44 33 22',
    status: 'En attente',
    join_date: '2024-04-10',
    created_at: '2024-04-10T00:00:00Z',
    updated_at: '2024-04-10T00:00:00Z',
  },
];

export const mockProjectClients: ProjectClient[] = [
  {
    project_id: 'project-1',
    client_id: 'client-1',
    unit_id: 'unit-3',
  },
  {
    project_id: 'project-1',
    client_id: 'client-2',
    unit_id: 'unit-2',
  },
];
