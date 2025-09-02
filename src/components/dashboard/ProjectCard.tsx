import { Building2, MapPin, User, Calendar, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    location: string;
    client: string;
    progress: number;
    status: 'in-progress' | 'completed' | 'delayed';
    dueDate: string;
    image: string;
  };
  onClick: () => void;
}

const statusConfig = {
  'in-progress': {
    label: 'En cours',
    labelAr: 'قيد التنفيذ',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  'completed': {
    label: 'Terminé',
    labelAr: 'مكتمل',
    className: 'bg-success/10 text-success border-success/20',
  },
  'delayed': {
    label: 'En retard',
    labelAr: 'متأخر',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
};

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const status = statusConfig[project.status];

  return (
    <Card className="overflow-hidden hover:shadow-luxury transition-all duration-300 cursor-pointer group border border-border/50 hover:border-accent/30">
      <div onClick={onClick} className="p-0">
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <Badge className={cn('absolute top-3 right-3', status.className)}>
            {status.label}
          </Badge>
        </div>

        {/* Project Info */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-accent transition-colors">
                {project.name}
              </h3>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-accent" />
                  {project.location}
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-accent" />
                  {project.client}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-accent" />
                  Échéance: {project.dueDate}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-accent hover:text-accent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-primary">Avancement</span>
              <span className="text-sm font-bold text-accent">{project.progress}%</span>
            </div>
            <Progress 
              value={project.progress} 
              className="h-2 bg-secondary"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}