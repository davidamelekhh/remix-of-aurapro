import { useEffect, useState } from 'react';
import { Building2, TrendingUp, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProNavigation } from '@/components/layout/ProNavigation';
import { useToast } from '@/hooks/use-toast';
import { getProjects, getClients } from '@/lib/api';

type Project = {
  id: string;
  name: string;
  location: string;
  progress: number;
  status: string;
  phase: string;
  image_url: string | null;
};

export default function ProDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalClients: 0,
    avgCompletion: 0,
    delayedProjects: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // TODO: Replace with actual authenticated user ID from your backend
      const mockUserId = 'mock-user-id';

      // Fetch projects using API layer
      const projectsData = await getProjects(mockUserId);
      const clientsData = await getClients(mockUserId);

      // Take first 5 projects for dashboard
      const recentProjects = projectsData.slice(0, 5);
      setProjects(recentProjects);

      const totalProjects = projectsData.length;
      const avgCompletion = totalProjects > 0
        ? Math.round(projectsData.reduce((acc, p) => acc + p.progress, 0) / totalProjects)
        : 0;
      const delayedProjects = projectsData.filter(p => p.status === 'Retard').length;

      setStats({
        totalProjects,
        totalClients: clientsData.length,
        avgCompletion,
        delayedProjects
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const statsDisplay = [{
    label: 'Projets actifs',
    value: stats.totalProjects.toString(),
    icon: Building2,
    color: 'text-success'
  }, {
    label: 'Clients',
    value: stats.totalClients.toString(),
    icon: Users,
    color: 'text-primary'
  }, {
    label: 'Taux de complétion',
    value: `${stats.avgCompletion}%`,
    icon: TrendingUp,
    color: 'text-success'
  }, {
    label: 'Prévisionnel',
    value: stats.delayedProjects.toString(),
    icon: Clock,
    color: 'text-destructive'
  }];

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
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <ProNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {statsDisplay.map(stat => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
                <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-3 pt-0 md:p-6 md:pt-0">
                <div className="text-lg md:text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Projects List */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg md:text-2xl">Tous les projets</CardTitle>
                <CardDescription className="text-xs md:text-sm">Gérez et suivez vos projets immobiliers</CardDescription>
              </div>
              <Link to="/pro/projects">
                <Button variant="outline" size="sm" className="text-xs md:text-sm">Voir tout</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {projects.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun projet pour le moment</p>
                <Link to="/pro/projects/new">
                  <Button className="mt-4">Créer votre premier projet</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                {projects.map(project => (
                  <Link key={project.id} to={`/pro/project/${project.id}`}>
                    <div className="border border-border rounded-lg overflow-hidden hover:bg-secondary/50 transition-all cursor-pointer group">
                      <div className="flex gap-3 md:gap-4">
                        {project.image_url && (
                          <div className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0 relative overflow-hidden">
                            <img src={project.image_url} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                        )}

                        <div className="flex-1 p-3 md:p-4">
                          <div className="flex items-start justify-between mb-2 md:mb-3">
                            <div>
                              <h3 className="font-semibold text-sm md:text-lg">{project.name}</h3>
                              <p className="text-xs md:text-sm text-muted-foreground">{project.location}</p>
                            </div>
                            <Badge variant={project.status === 'Retard' ? 'destructive' : 'default'} className="text-[10px] md:text-xs">
                              {project.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 md:gap-4 mb-2 md:mb-3 text-xs md:text-sm">
                            <div>
                              <span className="text-muted-foreground">Phase: </span>
                              <span className="font-medium">{project.phase}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Progression: </span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                          </div>

                          <Progress value={project.progress} className="h-1.5 md:h-2" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
