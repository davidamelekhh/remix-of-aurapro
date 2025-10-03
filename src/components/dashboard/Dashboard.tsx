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
    <div className="space-y-12 pb-12">

      {/* Stats Overview - Ultra Minimal Apple Style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6 md:p-8 group hover:shadow-glass">
            <div className="space-y-4">
              {/* Icon - monochrome, thin line */}
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:bg-foreground transition-colors duration-300">
                <stat.icon className="h-5 w-5 text-foreground group-hover:text-background" strokeWidth={1.5} />
              </div>
              
              {/* Metric - bold title, light supporting text */}
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground font-light">
                  {stat.name}
                </div>
              </div>
              
              {/* Change - subtle pill indicator */}
              <div className={cn(
                "inline-flex text-xs font-medium px-3 py-1.5 rounded-pill",
                stat.change.startsWith('+') 
                  ? "bg-foreground/5 text-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                {stat.change}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters - Pill shaped buttons */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveFilter(filter.id)}
          >
            <filter.icon className="h-4 w-4 mr-2" strokeWidth={1.5} />
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Projects Grid - Generous spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => handleProjectClick(project.id)}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <Building2 className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Aucun projet trouvé
          </h3>
          <p className="text-sm text-muted-foreground font-light">
            Aucun projet ne correspond aux filtres sélectionnés.
          </p>
        </div>
      )}
    </div>
  );
}