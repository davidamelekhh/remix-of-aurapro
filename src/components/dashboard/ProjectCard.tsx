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
    <Card className="overflow-hidden hover:shadow-glass transition-all duration-500 cursor-pointer group">
      <div onClick={onClick} className="p-0">
        {/* Project Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
          <Badge className={cn('absolute top-4 right-4 rounded-pill shadow-sm', status.className)}>
            {status.label}
          </Badge>
        </div>

        {/* Project Info */}
        <div className="p-6 space-y-6">
          {/* Title & Action */}
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-foreground/80 transition-colors">
              {project.name}
            </h3>
            
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
                <ChevronRight className="h-4 w-4 text-background" strokeWidth={2} />
              </div>
            </div>
          </div>
          
          {/* Details - Light text */}
          <div className="space-y-3 text-sm font-light text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-foreground/60" strokeWidth={1.5} />
              {project.location}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-foreground/60" strokeWidth={1.5} />
              {project.client}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-foreground/60" strokeWidth={1.5} />
              {project.dueDate}
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Avancement</span>
              <span className="text-lg font-bold text-foreground">{project.progress}%</span>
            </div>
            <Progress 
              value={project.progress} 
              className="h-1.5 bg-secondary"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}