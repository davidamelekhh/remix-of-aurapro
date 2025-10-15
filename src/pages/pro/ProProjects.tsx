import { useState, useEffect } from 'react';
import { Building2, Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProNavigation } from '@/components/layout/ProNavigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Project = {
  id: string;
  name: string;
  location: string;
  progress: number;
  status: string;
  phase: string;
  image_url: string | null;
  start_date: string;
  end_date: string;
};

export default function ProProjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
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

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ProNavigation />
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
      <ProNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end items-center mb-8">
          <Link to="/pro/projects/new">
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau projet
            </Button>
          </Link>
        </div>
        {/* Search & Filter */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un projet..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtrer
          </Button>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun projet</h3>
            <p className="text-muted-foreground mb-6">
              {searchTerm ? 'Aucun projet ne correspond à votre recherche' : 'Commencez par créer votre premier projet'}
            </p>
            <Link to="/pro/projects/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Créer un projet
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link key={project.id} to={`/pro/project/${project.id}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer h-full overflow-hidden">
                  {project.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.image_url}
                        alt={project.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <Badge 
                        variant={project.status === 'Retard' ? 'destructive' : 'default'}
                        className="absolute top-4 right-4"
                      >
                        {project.status}
                      </Badge>
                    </div>
                  )}

                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="mt-4">{project.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{project.location}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progression</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">Phase actuelle</p>
                          <p className="font-medium">{project.phase}</p>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        <p>Début: {new Date(project.start_date).toLocaleDateString('fr-FR')}</p>
                        <p>Fin prévue: {new Date(project.end_date).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
