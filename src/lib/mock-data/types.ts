// ============================================
// MOCK DATA TYPES
// These interfaces define the data structures for the application.
// When implementing your backend, create tables/collections matching these types.
// ============================================

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  company_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'pro' | 'client';
  created_at: string;
}

export interface Project {
  id: string;
  owner_id: string;
  name: string;
  location: string;
  description: string | null;
  progress: number;
  status: string;
  phase: string;
  image_url: string | null;
  start_date: string;
  end_date: string;
  estimated_revenue: number | null;
  created_at: string;
  updated_at: string;
}

export interface PropertyUnit {
  id: string;
  project_id: string;
  unit_number: string;
  unit_type: string;
  surface_area: number | null;
  price: number | null;
  status: string;
  floor: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  owner_id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  join_date: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectClient {
  project_id: string;
  client_id: string;
  unit_id: string | null;
}

export interface ProjectMilestone {
  id: string;
  project_id: string;
  milestone_key: string;
  label: string;
  description: string | null;
  status: string;
  progress_percentage: number;
  start_date: string | null;
  end_date: string | null;
  completed_at: string | null;
  order_index: number | null;
  is_conditional: boolean | null;
  is_enabled: boolean | null;
  condition_type: string | null;
  parent_milestone_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectExpense {
  id: string;
  project_id: string;
  created_by: string;
  title: string;
  description: string | null;
  amount: number;
  category: string;
  expense_date: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectPartner {
  id: string;
  project_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  percentage: number;
  role: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentSchedule {
  id: string;
  project_id: string;
  created_by: string;
  title: string;
  description: string | null;
  amount: number;
  due_date: string;
  payment_date: string | null;
  payment_percentage: number | null;
  unit_id: string | null;
  client_id: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectDocument {
  id: string;
  project_id: string;
  uploaded_by: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  file_type: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectMessage {
  id: string;
  project_id: string;
  sender_id: string;
  message: string;
  created_at: string;
}

export interface ProjectUpdate {
  id: string;
  project_id: string;
  created_by: string;
  title: string;
  description: string | null;
  update_type: string;
  progress_percentage: number | null;
  media_urls: string[] | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface Stakeholder {
  id: string;
  owner_id: string;
  name: string;
  role: string;
  company: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
  updated_at: string;
}

export interface StakeholderAssignment {
  id: string;
  stakeholder_id: string;
  milestone_id: string;
  assigned_at: string;
}

export interface ProjectConfiguration {
  id: string;
  project_id: string;
  has_existing_building: boolean | null;
  requires_destruction_authorization: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  phone: string | null;
  project_count: string | null;
  language: string;
  created_at: string;
}
