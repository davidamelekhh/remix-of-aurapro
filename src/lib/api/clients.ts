// ============================================
// API INTERFACE - CLIENTS
// TODO: Implement these functions with your backend
// ============================================

import type { Client, ProjectClient } from '../mock-data/types';
import { mockClients, mockProjectClients } from '../mock-data';

// ============================================
// CLIENTS API FUNCTIONS
// ============================================

/**
 * Get all clients for a user
 * TODO: Replace with actual API call
 */
export async function getClients(ownerId: string): Promise<Client[]> {
  console.log('TODO: Implement getClients with backend', ownerId);
  return mockClients.filter(c => c.owner_id === ownerId || c.owner_id === 'mock-user-id');
}

/**
 * Get a single client by ID
 * TODO: Replace with actual API call
 */
export async function getClient(clientId: string): Promise<Client | null> {
  console.log('TODO: Implement getClient with backend', clientId);
  return mockClients.find(c => c.id === clientId) || null;
}

/**
 * Create a new client
 * TODO: Replace with actual API call
 */
export async function createClient(data: {
  name: string;
  email: string;
  phone: string;
  ownerId: string;
}): Promise<{ client: Client | null; error: string | null }> {
  console.log('TODO: Implement createClient with backend', data);
  const newClient: Client = {
    id: `client-${Date.now()}`,
    owner_id: data.ownerId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    status: 'Actif',
    join_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return { client: newClient, error: null };
}

/**
 * Create a client account with authentication credentials
 * TODO: Replace with actual API call (this should create both a user account and a client record)
 */
export async function createClientAccount(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  ownerId: string;
}): Promise<{ client: Client | null; error: string | null }> {
  console.log('TODO: Implement createClientAccount with backend', data);
  // This should:
  // 1. Create an auth user account with the email/password
  // 2. Create a client record linked to the owner
  // 3. Create a user_role record with role='client'
  // 4. Create a profile record for the new user
  const newClient: Client = {
    id: `client-${Date.now()}`,
    owner_id: data.ownerId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    status: 'Actif',
    join_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return { client: newClient, error: null };
}

/**
 * Update a client
 * TODO: Replace with actual API call
 */
export async function updateClient(clientId: string, data: Partial<Client>): Promise<{ error: string | null }> {
  console.log('TODO: Implement updateClient with backend', clientId, data);
  return { error: null };
}

/**
 * Delete a client
 * TODO: Replace with actual API call
 */
export async function deleteClient(clientId: string): Promise<{ error: string | null }> {
  console.log('TODO: Implement deleteClient with backend', clientId);
  return { error: null };
}

// ============================================
// PROJECT-CLIENT ASSIGNMENTS API FUNCTIONS
// ============================================

/**
 * Get project-client assignments
 * TODO: Replace with actual API call
 */
export async function getProjectClients(projectId: string): Promise<ProjectClient[]> {
  console.log('TODO: Implement getProjectClients with backend', projectId);
  return mockProjectClients.filter(pc => pc.project_id === projectId);
}

/**
 * Assign a client to a project
 * TODO: Replace with actual API call
 */
export async function assignClientToProject(projectId: string, clientId: string, unitId?: string): Promise<{ error: string | null }> {
  console.log('TODO: Implement assignClientToProject with backend', projectId, clientId, unitId);
  return { error: null };
}

/**
 * Remove a client from a project
 * TODO: Replace with actual API call
 */
export async function removeClientFromProject(projectId: string, clientId: string): Promise<{ error: string | null }> {
  console.log('TODO: Implement removeClientFromProject with backend', projectId, clientId);
  return { error: null };
}

/**
 * Unassign a client from a specific project unit
 * TODO: Replace with actual API call
 */
export async function unassignClientFromProject(projectId: string, clientId: string, unitId: string): Promise<{ error: string | null }> {
  console.log('TODO: Implement unassignClientFromProject with backend', projectId, clientId, unitId);
  return { error: null };
}

/**
 * Update client unit assignment
 * TODO: Replace with actual API call
 */
export async function updateClientUnitAssignment(projectId: string, clientId: string, unitId: string | null): Promise<{ error: string | null }> {
  console.log('TODO: Implement updateClientUnitAssignment with backend', projectId, clientId, unitId);
  return { error: null };
}

/**
 * Get client's projects (for client dashboard)
 * TODO: Replace with actual API call
 */
export async function getClientProjects(clientEmail: string): Promise<{ projectId: string; unitId: string | null }[]> {
  console.log('TODO: Implement getClientProjects with backend', clientEmail);
  // Find client by email, then get their project assignments
  const client = mockClients.find(c => c.email.toLowerCase() === clientEmail.toLowerCase());
  if (!client) return [];
  return mockProjectClients
    .filter(pc => pc.client_id === client.id)
    .map(pc => ({ projectId: pc.project_id, unitId: pc.unit_id }));
}
