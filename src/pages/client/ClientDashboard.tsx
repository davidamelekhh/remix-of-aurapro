import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Navigation } from '@/components/layout/Navigation';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { Building2 } from 'lucide-react';

type PropertyUnit = {
  id: string;
  unit_number: string;
  unit_type: string;
  surface_area: number | null;
  price: number | null;
  status: string;
  floor: string | null;
};

type Project = {
  id: string;
  name: string;
  location: string;
  description: string;
  phase: string;
  status: string;
  progress: number;
  image_url: string | null;
  assigned_unit?: PropertyUnit;
};

export default function ClientDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchClientProjects();
  }, []);

  const fetchClientProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get user's email from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', user.id)
        .single();

      if (!profile?.email) return;

      // Find client ID based on email (case insensitive)
      const { data: clientData } = await supabase
        .from('clients')
        .select('id')
        .ilike('email', profile.email)
        .single();

      if (!clientData) {
        setProjects([]);
        return;
      }

      // Get project assignments with unit details
      const { data: projectClients } = await supabase
        .from('project_clients')
        .select(`
          project_id,
          unit_id,
          property_units (
            id,
            unit_number,
            unit_type,
            surface_area,
            price,
            status,
            floor
          )
        `)
        .eq('client_id', clientData.id);

      if (!projectClients || projectClients.length === 0) {
        setProjects([]);
        return;
      }

      const projectIds = [...new Set(projectClients.map(pc => pc.project_id))];

      // Get projects
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .in('id', projectIds);

      if (error) throw error;

      // Map projects with their assigned units
      const projectsWithUnits = (data || []).map(project => {
        const assignment = projectClients.find(pc => pc.project_id === project.id);
        return {
          ...project,
          assigned_unit: assignment?.property_units as PropertyUnit | undefined,
        };
      });

      setProjects(projectsWithUnits);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mes Projets</h1>
          <p className="text-muted-foreground mt-2">
            Suivez l'avancement de vos projets immobiliers
          </p>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
              <CardTitle className="text-xl mb-2">Aucun projet assigné</CardTitle>
              <CardDescription>
                Vous n'avez pas encore de projets assignés. Contactez votre promoteur.
              </CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {project.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                  <p className="text-muted-foreground mb-4">{project.location}</p>
                  
                  {project.assigned_unit && (
                    <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Votre bien</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lot:</span>
                          <span className="font-medium">{project.assigned_unit.unit_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium">{project.assigned_unit.unit_type}</span>
                        </div>
                        {project.assigned_unit.surface_area && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Surface:</span>
                            <span className="font-medium">{project.assigned_unit.surface_area} m²</span>
                          </div>
                        )}
                        {project.assigned_unit.floor && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Étage:</span>
                            <span className="font-medium">{project.assigned_unit.floor}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Phase:</span>
                      <span className="font-medium">{project.phase}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Statut:</span>
                      <span className="font-medium">{project.status}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avancement:</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
