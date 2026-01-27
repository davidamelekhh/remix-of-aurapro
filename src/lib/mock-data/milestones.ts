import type { ProjectMilestone, ProjectUpdate, ProjectDocument, ProjectMessage } from './types';

// ============================================
// MOCK MILESTONES, UPDATES, DOCUMENTS, MESSAGES
// Replace these with API calls to your backend
// ============================================

// Re-export milestones from projects.ts for convenience
export { mockProjectMilestones } from './projects';

export const mockProjectUpdates: ProjectUpdate[] = [
  {
    id: 'update-1',
    project_id: 'project-1',
    created_by: 'mock-user-id',
    title: 'Début des travaux de fondation',
    description: 'Les travaux de fondation ont officiellement commencé aujourd\'hui. L\'équipe est en place et le béton sera coulé la semaine prochaine.',
    update_type: 'general',
    progress_percentage: 15,
    media_urls: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400'],
    start_date: null,
    end_date: null,
    status: 'completed',
    created_at: '2024-03-20T10:00:00Z',
    updated_at: '2024-03-20T10:00:00Z',
  },
  {
    id: 'update-2',
    project_id: 'project-1',
    created_by: 'mock-user-id',
    title: 'Coulage du radier terminé',
    description: 'Le radier a été coulé avec succès. Le séchage est en cours et nous pourrons commencer les murs de fondation dans 7 jours.',
    update_type: 'milestone',
    progress_percentage: 25,
    media_urls: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400'],
    start_date: '2024-03-20',
    end_date: '2024-04-05',
    status: 'completed',
    created_at: '2024-04-05T14:30:00Z',
    updated_at: '2024-04-05T14:30:00Z',
  },
  {
    id: 'update-3',
    project_id: 'project-1',
    created_by: 'mock-user-id',
    title: 'Avancement structure RDC',
    description: 'Les poteaux et poutres du rez-de-chaussée sont en place. Nous procédons maintenant au coffrage du plancher haut.',
    update_type: 'general',
    progress_percentage: 45,
    media_urls: null,
    start_date: null,
    end_date: null,
    status: 'in_progress',
    created_at: '2024-05-15T09:00:00Z',
    updated_at: '2024-05-15T09:00:00Z',
  },
];

export const mockProjectDocuments: ProjectDocument[] = [
  {
    id: 'doc-1',
    project_id: 'project-1',
    uploaded_by: 'mock-user-id',
    file_name: 'Plans architecte v2.pdf',
    file_path: 'project-1/plans-v2.pdf',
    file_size: 2500000,
    file_type: 'application/pdf',
    description: 'Plans d\'exécution validés',
    created_at: '2024-02-10T00:00:00Z',
    updated_at: '2024-02-10T00:00:00Z',
  },
  {
    id: 'doc-2',
    project_id: 'project-1',
    uploaded_by: 'mock-user-id',
    file_name: 'Permis de construire.pdf',
    file_path: 'project-1/permis.pdf',
    file_size: 850000,
    file_type: 'application/pdf',
    description: 'Permis de construire approuvé',
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-03-10T00:00:00Z',
  },
  {
    id: 'doc-3',
    project_id: 'project-1',
    uploaded_by: 'mock-user-id',
    file_name: 'Contrat entreprise générale.pdf',
    file_path: 'project-1/contrat-eg.pdf',
    file_size: 1200000,
    file_type: 'application/pdf',
    description: 'Contrat avec l\'entreprise de construction',
    created_at: '2024-03-15T00:00:00Z',
    updated_at: '2024-03-15T00:00:00Z',
  },
];

export const mockProjectMessages: ProjectMessage[] = [
  {
    id: 'msg-1',
    project_id: 'project-1',
    sender_id: 'mock-user-id',
    message: 'Bienvenue dans l\'espace de suivi de votre projet. N\'hésitez pas à nous contacter pour toute question.',
    created_at: '2024-02-15T10:00:00Z',
  },
  {
    id: 'msg-2',
    project_id: 'project-1',
    sender_id: 'client-1',
    message: 'Merci pour les mises à jour régulières. Quand est-ce que les travaux de structure seront terminés ?',
    created_at: '2024-05-20T14:30:00Z',
  },
  {
    id: 'msg-3',
    project_id: 'project-1',
    sender_id: 'mock-user-id',
    message: 'La structure devrait être terminée fin août. Nous restons dans les délais prévus.',
    created_at: '2024-05-20T15:45:00Z',
  },
];
