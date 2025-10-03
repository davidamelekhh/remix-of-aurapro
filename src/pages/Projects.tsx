import { Navigation } from '@/components/layout/Navigation';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import heroBuilding from '@/assets/hero-building.jpg';
import projectVilla from '@/assets/project-villa.jpg';
import projectApartment from '@/assets/project-apartment.jpg';

const allProjects = [
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
  {
    id: '4',
    name: 'Appartement Tanger Bay',
    location: 'Tanger, Malabata',
    client: 'Youssef Benjelloun',
    progress: 60,
    status: 'in-progress' as const,
    dueDate: '25 Avril 2024',
    image: projectVilla,
  },
  {
    id: '5',
    name: 'Bureau Agdal',
    location: 'Rabat, Agdal',
    client: 'Société Tech Innovation',
    progress: 30,
    status: 'in-progress' as const,
    dueDate: '15 Mai 2024',
    image: heroBuilding,
  },
  {
    id: '6',
    name: 'Villa Essaouira',
    location: 'Essaouira, Medina',
    client: 'Amina Tazi',
    progress: 100,
    status: 'completed' as const,
    dueDate: '10 Février 2024',
    image: projectApartment,
  },
];

export default function Projects() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = allProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tous les projets</h1>
              <p className="text-sm text-muted-foreground font-light mt-1">
                {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''}
              </p>
            </div>
            <Button className="self-start sm:self-auto">
              <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
              Nouveau projet
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <Input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                <Search className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Aucun projet trouvé
              </h3>
              <p className="text-sm text-muted-foreground font-light">
                Essayez de modifier votre recherche
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
