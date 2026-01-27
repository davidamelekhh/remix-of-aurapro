import type { ProjectPartner } from './types';

// ============================================
// MOCK PARTNERS DATA
// Replace these with API calls to your backend
// ============================================

export const mockPartners: ProjectPartner[] = [
  {
    id: 'partner-1',
    project_id: 'project-1',
    name: 'Ahmed Benali',
    email: 'ahmed@promoteur.com',
    phone: '+212 5 22 33 44 55',
    percentage: 60,
    role: 'Promoteur principal',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'partner-2',
    project_id: 'project-1',
    name: 'Youssef El Amrani',
    email: 'youssef@investisseur.com',
    phone: '+212 6 77 88 99 00',
    percentage: 25,
    role: 'Investisseur',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'partner-3',
    project_id: 'project-1',
    name: 'Nadia Tazi',
    email: 'nadia@partenaire.com',
    phone: '+212 6 11 22 33 44',
    percentage: 15,
    role: 'Partenaire technique',
    created_at: '2024-01-20T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
];
