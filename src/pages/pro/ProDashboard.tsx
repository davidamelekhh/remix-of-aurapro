import { useEffect, useState } from 'react';
import { Building2, TrendingUp, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
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
  const {
    toast
  } = useToast();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const {
        data: {
          user
        }
      } = await supabase.auth.getUser();
      if (!user) return;
      const {
        data: projectsData,
        error: projectsError
      } = await supabase.from('projects').select('*').eq('owner_id', user.id).order('created_at', {
        ascending: false
      }).limit(5);
      if (projectsError) throw projectsError;
      const {
        count: clientsCount,
        error: clientsError
      } = await supabase.from('clients').select('*', {
        count: 'exact',
        head: true
      }).eq('owner_id', user.id);
      if (clientsError) throw clientsError;
      setProjects(projectsData || []);
      const totalProjects = projectsData?.length || 0;
      const avgCompletion = totalProjects > 0 ? Math.round(projectsData.reduce((acc, p) => acc + p.progress, 0) / totalProjects) : 0;
      const delayedProjects = projectsData?.filter(p => p.status === 'Retard').length || 0;
      setStats({
        totalProjects,
        totalClients: clientsCount || 0,
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
    label: 'En retard',
    value: stats.delayedProjects.toString(),
    icon: Clock,
    color: 'text-destructive'
  }];
  if (loading) {
    return <div className="min-h-screen bg-background">
        <ProNavigation />
        <div className="flex items-center justify-center h-96">
          
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-background">
      <ProNavigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsDisplay.map(stat => <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>)}
        </div>

        {/* Projects List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Tous les projets</CardTitle>
                <CardDescription>Gérez et suivez vos projets immobiliers</CardDescription>
              </div>
              <Link to="/pro/projects">
                <Button variant="outline">Voir tout</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {projects.length === 0 ? <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun projet pour le moment</p>
                <Link to="/pro/projects/new">
                  <Button className="mt-4">Créer votre premier projet</Button>
                </Link>
              </div> : <div className="space-y-4">
                {projects.map(project => <Link key={project.id} to={`/pro/project/${project.id}`}>
                    <div className="border border-border rounded-lg overflow-hidden hover:bg-secondary/50 transition-all cursor-pointer group">
                      <div className="flex gap-4">
                        {project.image_url && <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden">
                            <img src={project.image_url} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>}

                        <div className="flex-1 p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{project.name}</h3>
                              <p className="text-sm text-muted-foreground">{project.location}</p>
                            </div>
                            <Badge variant={project.status === 'Retard' ? 'destructive' : 'default'}>
                              {project.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                            <div>
                              <span className="text-muted-foreground">Phase: </span>
                              <span className="font-medium">{project.phase}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Progression: </span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                          </div>

                          <Progress value={project.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </Link>)}
              </div>}
          </CardContent>
        </Card>
      </div>
    </div>;
}