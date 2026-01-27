// ============================================
// MOCK DATA - CENTRAL EXPORTS
// This file exports all mock data for development.
// When building your backend, replace these imports
// with actual API calls.
// ============================================

// Types
export * from './types';

// User data
export { mockProfile, mockUserRole, mockUser } from './users';

// Projects
export { 
  mockProjects, 
  mockPropertyUnits, 
  mockProjectMilestones,
  mockProjectConfigurations 
} from './projects';

// Clients
export { mockClients, mockProjectClients } from './clients';

// Stakeholders
export { mockStakeholders, mockStakeholderAssignments } from './stakeholders';

// Payments
export { mockPayments } from './payments';

// Expenses
export { mockExpenses } from './expenses';

// Partners
export { mockPartners } from './partners';

// Milestones, Updates, Documents, Messages
export { 
  mockProjectUpdates, 
  mockProjectDocuments, 
  mockProjectMessages 
} from './milestones';
