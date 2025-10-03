import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { MapPin, User, Calendar } from 'lucide-react';

const mockProjects = [
  {
    id: '1',
    name: 'Villa Moderne',
    location: 'Casablanca',
    client: 'Ahmed Benali',
    progress: 65,
    status: 'in-progress' as const,
    dueDate: '2024-06-15',
    image: '/src/assets/project-villa.jpg'
  },
  {
    id: '2',
    name: 'Appartement Centre-Ville',
    location: 'Rabat',
    client: 'Ahmed Benali',
    progress: 100,
    status: 'completed' as const,
    dueDate: '2024-03-20',
    image: '/src/assets/project-apartment.jpg'
  }
];

const statusConfig = {
  'in-progress': { label: 'En cours', labelAr: 'جاري', className: 'bg-blue-500' },
  'completed': { label: 'Terminé', labelAr: 'مكتمل', className: 'bg-success' },
  'delayed': { label: 'Retardé', labelAr: 'متأخر', className: 'bg-destructive' }
};

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold">Mes Projets</h1>
          <p className="text-muted-foreground mt-1">Suivez l'avancement de vos biens</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <div className="relative h-48">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-4 right-4 ${statusConfig[project.status].className}`}>
                  {statusConfig[project.status].label}
                </Badge>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{project.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(project.dueDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avancement</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
