-- Ajouter les colonnes pour gérer les conditions et sous-étapes
ALTER TABLE project_milestones ADD COLUMN IF NOT EXISTS is_conditional BOOLEAN DEFAULT FALSE;
ALTER TABLE project_milestones ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN DEFAULT TRUE;
ALTER TABLE project_milestones ADD COLUMN IF NOT EXISTS parent_milestone_id UUID REFERENCES project_milestones(id) ON DELETE CASCADE;
ALTER TABLE project_milestones ADD COLUMN IF NOT EXISTS condition_type TEXT;
ALTER TABLE project_milestones ADD COLUMN IF NOT EXISTS order_index INTEGER;

-- Créer une table pour stocker les configurations de projet (conditions)
CREATE TABLE IF NOT EXISTS project_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  requires_destruction_authorization BOOLEAN DEFAULT FALSE,
  has_existing_building BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE project_configurations ENABLE ROW LEVEL SECURITY;

-- RLS policies pour project_configurations
CREATE POLICY "Owners can manage project configurations"
  ON project_configurations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_configurations.project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Clients can view their project configurations"
  ON project_configurations
  FOR SELECT
  USING (
    is_client_assigned_to_project(project_id, get_current_user_client_id())
  );