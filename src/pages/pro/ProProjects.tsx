import { useState } from 'react';
import { Building2, Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProNavigation } from '@/components/layout/ProNavigation';
import heroBuilding from '@/assets/hero-building.jpg';
import projectVilla from '@/assets/project-villa.jpg';
import projectApartment from '@/assets/project-apartment.jpg';

const projects = [
  { id: 1, name: 'Résidence Les Jardins', location: 'Casablanca', progress: 75, status: 'En cours', clients: 12, phase: 'Finitions', startDate: '2024-01-15', endDate: '2024-12-30', image: projectVilla },
  { id: 2, name: 'Villa Moderne Atlas', location: 'Marrakech', progress: 45, status: 'En cours', clients: 1, phase: 'Structure', startDate: '2024-03-01', endDate: '2025-02-28', image: heroBuilding },
  { id: 3, name: 'Complexe Marina Bay', location: 'Tanger', progress: 90, status: 'En cours', clients: 24, phase: 'Livraison', startDate: '2023-06-01', endDate: '2024-11-30', image: projectApartment },
  { id: 4, name: 'Appartements Ocean View', location: 'Agadir', progress: 30, status: 'En cours', clients: 8, phase: 'Fondations', startDate: '2024-05-01', endDate: '2025-06-30', image: projectVilla },
  { id: 5, name: 'Résidence Palm Garden', location: 'Rabat', progress: 15, status: 'Retard', clients: 6, phase: 'Terrassement', startDate: '2024-02-01', endDate: '2025-01-31', image: heroBuilding },
  { id: 6, name: 'Tour Sky Heights', location: 'Casablanca', progress: 60, status: 'En cours', clients: 18, phase: 'Étages supérieurs', startDate: '2023-09-01', endDate: '2025-03-31', image: projectApartment },
];

export default function ProProjects() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <ProNavigation />
      
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestion des projets</h1>
              <p className="text-muted-foreground mt-1">Créez et gérez vos projets immobiliers</p>
            </div>
            <Link to="/pro/projects/new">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                Nouveau projet
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link key={project.id} to={`/pro/project/${project.id}`}>
              <Card className="hover:shadow-lg transition-all cursor-pointer h-full overflow-hidden">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
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
                      <div>
                        <p className="text-muted-foreground">Clients</p>
                        <p className="font-medium">{project.clients}</p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground pt-2 border-t">
                      <p>Début: {new Date(project.startDate).toLocaleDateString('fr-FR')}</p>
                      <p>Fin prévue: {new Date(project.endDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
