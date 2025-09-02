import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, TrendingUp, Clock, CheckCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectCard } from './ProjectCard';
import heroBuilding from '@/assets/hero-building.jpg';
import projectVilla from '@/assets/project-villa.jpg';
import projectApartment from '@/assets/project-apartment.jpg';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'in-progress' | 'completed' | 'delayed';

const filters: { id: FilterType; label: string; labelAr: string; icon: any }[] = [
  { id: 'all', label: 'Tous les projets', labelAr: 'جميع المشاريع', icon: Building2 },
  { id: 'in-progress', label: 'En cours', labelAr: 'قيد التنفيذ', icon: TrendingUp },
  { id: 'delayed', label: 'En retard', labelAr: 'متأخر', icon: Clock },
  { id: 'completed', label: 'Terminés', labelAr: 'مكتمل', icon: CheckCircle },
];

const mockProjects = [
  {
    id: '1',
    name: 'Résidence Al Andalus',
    location: 'Casablanca, Ain Diab',
    client: 'Mohammed Ben Ahmed',
    progress: 75,
    status: 'in-progress' as const,
    dueDate: '15 Mars 2024',
    image: projectVilla,
  },
  {
    id: '2',
    name: 'Villa Moderne Rabat',
    location: 'Rabat, Souissi',
    client: 'Fatima El Mansouri',
    progress: 100,
    status: 'completed' as const,
    dueDate: '28 Février 2024',
    image: projectApartment,
  },
  {
    id: '3',
    name: 'Complex Marrakech Gardens',
    location: 'Marrakech, Gueliz',
    client: 'Omar Benali',
    progress: 45,
    status: 'delayed' as const,
    dueDate: '10 Avril 2024',
    image: heroBuilding,
  },
];

const stats = [
  { name: 'Projets actifs', nameAr: 'المشاريع النشطة', value: '12', change: '+2', icon: Building2 },
  { name: 'Taux de réussite', nameAr: 'معدل النجاح', value: '95%', change: '+5%', icon: TrendingUp },
  { name: 'Projets terminés', nameAr: 'المشاريع المكتملة', value: '24', change: '+3', icon: CheckCircle },
  { name: 'En retard', nameAr: 'متأخر', value: '2', change: '-1', icon: Clock },
];

export function Dashboard() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const navigate = useNavigate();

  const filteredProjects = mockProjects.filter(project => 
    activeFilter === 'all' || project.status === activeFilter
  );

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section - Mobile First */}
      <div className="text-center py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-light text-foreground mb-3">
          Bienvenue sur ImoTrack
        </h1>
        <p className="text-base text-muted-foreground max-w-md mx-auto font-light">
          Suivez vos projets immobiliers avec élégance et précision
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6 hover:shadow-soft transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </p>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
              </div>
              <div className="flex flex-col items-end">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-2">
                  <stat.icon className="h-6 w-6 text-accent" />
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stat.change}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "transition-all duration-200",
              activeFilter === filter.id && "bg-accent text-accent-foreground hover:bg-accent/90"
            )}
          >
            <filter.icon className="h-4 w-4 mr-2" />
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => handleProjectClick(project.id)}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-primary mb-2">
            Aucun projet trouvé
          </h3>
          <p className="text-muted-foreground">
            Aucun projet ne correspond aux filtres sélectionnés.
          </p>
        </div>
      )}
    </div>
  );
}