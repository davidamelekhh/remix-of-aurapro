// ============================================
// API INTERFACE - PAYMENTS, EXPENSES, PARTNERS
// TODO: Implement these functions with your backend
// ============================================

import type { PaymentSchedule, ProjectExpense, ProjectPartner } from '../mock-data/types';
import { mockPayments, mockExpenses, mockPartners } from '../mock-data';

// ============================================
// PAYMENTS API FUNCTIONS
// ============================================

/**
 * Get payment schedules for a project
 * TODO: Replace with actual API call
 */
export async function getProjectPayments(projectId: string): Promise<PaymentSchedule[]> {
  console.log('TODO: Implement getProjectPayments with backend', projectId);
  return mockPayments.filter(p => p.project_id === projectId);
}

/**
 * Create a payment schedule
 * TODO: Replace with actual API call
 */
export async function createPayment(data: Omit<PaymentSchedule, 'id' | 'created_at' | 'updated_at'>): Promise<{ payment: PaymentSchedule | null; error: string | null }> {
  console.log('TODO: Implement createPayment with backend', data);
  const newPayment: PaymentSchedule = {
    ...data,
    id: `payment-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return { payment: newPayment, error: null };
}

/**
 * Update a payment schedule
 * TODO: Replace with actual API call
 */
export async function updatePayment(paymentId: string, data: Partial<PaymentSchedule>): Promise<{ error: string | null }> {
  console.log('TODO: Implement updatePayment with backend', paymentId, data);
  return { error: null };
}

/**
 * Delete a payment schedule
 * TODO: Replace with actual API call
 */
export async function deletePayment(paymentId: string): Promise<{ error: string | null }> {
  console.log('TODO: Implement deletePayment with backend', paymentId);
  return { error: null };
}

// ============================================
// EXPENSES API FUNCTIONS
// ============================================

/**
 * Get expenses for a project
 * TODO: Replace with actual API call
 */
export async function getProjectExpenses(projectId: string): Promise<ProjectExpense[]> {
  console.log('TODO: Implement getProjectExpenses with backend', projectId);
  return mockExpenses.filter(e => e.project_id === projectId);
}

/**
 * Create an expense
 * TODO: Replace with actual API call
 */
export async function createExpense(data: Omit<ProjectExpense, 'id' | 'created_at' | 'updated_at'>): Promise<{ expense: ProjectExpense | null; error: string | null }> {
  console.log('TODO: Implement createExpense with backend', data);
  const newExpense: ProjectExpense = {
    ...data,
    id: `expense-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return { expense: newExpense, error: null };
}

/**
 * Update an expense
 * TODO: Replace with actual API call
 */
export async function updateExpense(expenseId: string, data: Partial<ProjectExpense>): Promise<{ error: string | null }> {
  console.log('TODO: Implement updateExpense with backend', expenseId, data);
  return { error: null };
}

/**
 * Delete an expense
 * TODO: Replace with actual API call
 */
export async function deleteExpense(expenseId: string): Promise<{ error: string | null }> {
  console.log('TODO: Implement deleteExpense with backend', expenseId);
  return { error: null };
}

// ============================================
// PARTNERS API FUNCTIONS
// ============================================

/**
 * Get partners for a project
 * TODO: Replace with actual API call
 */
export async function getProjectPartners(projectId: string): Promise<ProjectPartner[]> {
  console.log('TODO: Implement getProjectPartners with backend', projectId);
  return mockPartners.filter(p => p.project_id === projectId);
}

/**
 * Create a partner
 * TODO: Replace with actual API call
 */
export async function createPartner(data: Omit<ProjectPartner, 'id' | 'created_at' | 'updated_at'>): Promise<{ partner: ProjectPartner | null; error: string | null }> {
  console.log('TODO: Implement createPartner with backend', data);
  const newPartner: ProjectPartner = {
    ...data,
    id: `partner-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return { partner: newPartner, error: null };
}

/**
 * Update a partner
 * TODO: Replace with actual API call
 */
export async function updatePartner(partnerId: string, data: Partial<ProjectPartner>): Promise<{ error: string | null }> {
  console.log('TODO: Implement updatePartner with backend', partnerId, data);
  return { error: null };
}

/**
 * Delete a partner
 * TODO: Replace with actual API call
 */
export async function deletePartner(partnerId: string): Promise<{ error: string | null }> {
  console.log('TODO: Implement deletePartner with backend', partnerId);
  return { error: null };
}
