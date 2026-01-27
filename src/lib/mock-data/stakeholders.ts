import type { Stakeholder, StakeholderAssignment } from './types';

// ============================================
// MOCK STAKEHOLDERS DATA
// Replace these with API calls to your backend
// ============================================

export const mockStakeholders: Stakeholder[] = [
  {
    id: 'stakeholder-1',
    owner_id: 'mock-user-id',
    name: 'Jean-Pierre Martin',
    role: 'Architecte',
    company: 'Cabinet Martin & Associés',
    phone: '+212 5 22 11 22 33',
    email: 'jp.martin@cabinet.com',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
  },
  {
    id: 'stakeholder-2',
    owner_id: 'mock-user-id',
    name: 'Hassan El Idrissi',
    role: 'Ingénieur BET',
    company: 'BET Maroc',
    phone: '+212 6 11 22 33 44',
    email: 'h.idrissi@betmaroc.com',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'stakeholder-3',
    owner_id: 'mock-user-id',
    name: 'Omar Benjelloun',
    role: 'Entrepreneur général',
    company: 'Construction Plus',
    phone: '+212 6 55 66 77 88',
    email: 'omar@constructionplus.ma',
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-01T00:00:00Z',
  },
  {
    id: 'stakeholder-4',
    owner_id: 'mock-user-id',
    name: 'Amina Chraibi',
    role: 'Électricien',
    company: 'Électricité Générale',
    phone: '+212 6 99 88 77 66',
    email: 'amina@elecgen.ma',
    created_at: '2024-02-15T00:00:00Z',
    updated_at: '2024-02-15T00:00:00Z',
  },
];

export const mockStakeholderAssignments: StakeholderAssignment[] = [
  {
    id: 'assignment-1',
    stakeholder_id: 'stakeholder-1',
    milestone_id: 'milestone-1',
    assigned_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'assignment-2',
    stakeholder_id: 'stakeholder-2',
    milestone_id: 'milestone-3',
    assigned_at: '2024-03-25T00:00:00Z',
  },
  {
    id: 'assignment-3',
    stakeholder_id: 'stakeholder-3',
    milestone_id: 'milestone-3',
    assigned_at: '2024-03-25T00:00:00Z',
  },
];
