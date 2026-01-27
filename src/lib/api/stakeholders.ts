// ============================================
// API INTERFACE - STAKEHOLDERS
// TODO: Implement these functions with your backend
// ============================================

import type { Stakeholder, StakeholderAssignment } from '../mock-data/types';
import { mockStakeholders, mockStakeholderAssignments } from '../mock-data';

// ============================================
// STAKEHOLDERS API FUNCTIONS
// ============================================

/**
 * Get all stakeholders for a user
 * TODO: Replace with actual API call
 */
export async function getStakeholders(ownerId: string): Promise<Stakeholder[]> {
  console.log('TODO: Implement getStakeholders with backend', ownerId);
  return mockStakeholders.filter(s => s.owner_id === ownerId || s.owner_id === 'mock-user-id');
}

/**
 * Get a single stakeholder by ID
 * TODO: Replace with actual API call
 */
export async function getStakeholder(stakeholderId: string): Promise<Stakeholder | null> {
  console.log('TODO: Implement getStakeholder with backend', stakeholderId);
  return mockStakeholders.find(s => s.id === stakeholderId) || null;
}

/**
 * Create a new stakeholder
 * TODO: Replace with actual API call
 */
export async function createStakeholder(data: {
  ownerId: string;
  name: string;
  role: string;
  company?: string;
  phone?: string;
  email?: string;
}): Promise<{ stakeholder: Stakeholder | null; error: string | null }> {
  console.log('TODO: Implement createStakeholder with backend', data);
  const newStakeholder: Stakeholder = {
    id: `stakeholder-${Date.now()}`,
    owner_id: data.ownerId,
    name: data.name,
    role: data.role,
    company: data.company || null,
    phone: data.phone || null,
    email: data.email || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return { stakeholder: newStakeholder, error: null };
}

/**
 * Update a stakeholder
 * TODO: Replace with actual API call
 */
export async function updateStakeholder(stakeholderId: string, data: Partial<Stakeholder>): Promise<{ error: string | null }> {
  console.log('TODO: Implement updateStakeholder with backend', stakeholderId, data);
  return { error: null };
}

/**
 * Delete a stakeholder
 * TODO: Replace with actual API call
 */
export async function deleteStakeholder(stakeholderId: string): Promise<{ error: string | null }> {
  console.log('TODO: Implement deleteStakeholder with backend', stakeholderId);
  return { error: null };
}

// ============================================
// STAKEHOLDER ASSIGNMENTS API FUNCTIONS
// ============================================

/**
 * Get stakeholder assignments for a milestone
 * TODO: Replace with actual API call
 */
export async function getMilestoneStakeholders(milestoneId: string): Promise<StakeholderAssignment[]> {
  console.log('TODO: Implement getMilestoneStakeholders with backend', milestoneId);
  return mockStakeholderAssignments.filter(a => a.milestone_id === milestoneId);
}

/**
 * Assign a stakeholder to a milestone
 * TODO: Replace with actual API call
 */
export async function assignStakeholderToMilestone(milestoneId: string, stakeholderId: string): Promise<{ error: string | null }> {
  console.log('TODO: Implement assignStakeholderToMilestone with backend', milestoneId, stakeholderId);
  return { error: null };
}

/**
 * Remove a stakeholder from a milestone
 * TODO: Replace with actual API call
 */
export async function removeStakeholderFromMilestone(milestoneId: string, stakeholderId: string): Promise<{ error: string | null }> {
  console.log('TODO: Implement removeStakeholderFromMilestone with backend', milestoneId, stakeholderId);
  return { error: null };
}
