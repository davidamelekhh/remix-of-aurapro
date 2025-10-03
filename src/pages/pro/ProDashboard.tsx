import { Building2, TrendingUp, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ProNavigation } from '@/components/layout/ProNavigation';
import heroBuilding from '@/assets/hero-building.jpg';
import projectVilla from '@/assets/project-villa.jpg';
import projectApartment from '@/assets/project-apartment.jpg';

// Mock data
const stats = [
  { label: 'Projets actifs', value: '12', icon: Building2, trend: '+2', color: 'text-success' },
  { label: 'Clients', value: '48', icon: Users, trend: '+8', color: 'text-primary' },
  { label: 'Taux de complétion', value: '67%', icon: TrendingUp, trend: '+5%', color: 'text-success' },
  { label: 'En retard', value: '2', icon: Clock, trend: '-1', color: 'text-destructive' },
];

const projects = [
  { id: 1, name: 'Résidence Les Jardins', location: 'Casablanca', progress: 75, status: 'En cours', clients: 12, phase: 'Finitions', image: projectVilla },
  { id: 2, name: 'Villa Moderne Atlas', location: 'Marrakech', progress: 45, status: 'En cours', clients: 1, phase: 'Structure', image: heroBuilding },
  { id: 3, name: 'Complexe Marina Bay', location: 'Tanger', progress: 90, status: 'En cours', clients: 24, phase: 'Livraison', image: projectApartment },
  { id: 4, name: 'Appartements Ocean View', location: 'Agadir', progress: 30, status: 'En cours', clients: 8, phase: 'Fondations', image: projectVilla },
  { id: 5, name: 'Résidence Palm Garden', location: 'Rabat', progress: 15, status: 'Retard', clients: 6, phase: 'Terrassement', image: heroBuilding },
];

export default function ProDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <ProNavigation />
      
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard Promoteur</h1>
              <p className="text-muted-foreground mt-1">Vue d'ensemble de vos projets</p>
            </div>
            <Link to="/pro/projects/new">
              <Button size="lg">
                <Building2 className="mr-2 h-4 w-4" />
                Nouveau projet
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.color} flex items-center mt-1`}>
                  {stat.trend}
                  <span className="text-muted-foreground ml-1">vs. mois dernier</span>
                </p>
              </CardContent>
            </Card>
          ))}
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
            <div className="space-y-4">
              {projects.map((project) => (
                <Link key={project.id} to={`/pro/project/${project.id}`}>
                  <div className="border border-border rounded-lg overflow-hidden hover:bg-secondary/50 transition-all cursor-pointer group">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-32 h-32 flex-shrink-0 relative overflow-hidden">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
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
                        
                        <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Phase: </span>
                            <span className="font-medium">{project.phase}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Clients: </span>
                            <span className="font-medium">{project.clients}</span>
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
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
