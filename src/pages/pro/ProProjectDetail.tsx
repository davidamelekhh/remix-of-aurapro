import { useState } from 'react';
import { ArrowLeft, Users, Calendar, MapPin, Edit, Trash2, UserPlus } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ProNavigation } from '@/components/layout/ProNavigation';
import projectVilla from '@/assets/project-villa.jpg';

// Mock data
const projectData = {
  id: 1,
  name: 'Résidence Les Jardins',
  location: 'Casablanca, Maroc',
  client: 'Promoteur Nexo',
  status: 'En cours',
  progress: 75,
  startDate: '2024-01-15',
  endDate: '2024-12-30',
  description: 'Résidence moderne avec espaces verts et équipements haut de gamme.',
  budget: '45 000 000 MAD',
  surface: '12 000 m²',
  image: projectVilla,
};

const milestones = [
  { id: 1, name: 'Terrassement', status: 'Terminé', progress: 100, date: '2024-02-01' },
  { id: 2, name: 'Fondations', status: 'Terminé', progress: 100, date: '2024-03-15' },
  { id: 3, name: 'Structure', status: 'Terminé', progress: 100, date: '2024-05-30' },
  { id: 4, name: 'Finitions', status: 'En cours', progress: 75, date: '2024-10-15' },
  { id: 5, name: 'Livraison', status: 'Planifié', progress: 0, date: '2024-12-30' },
];

const assignedClients = [
  { id: 1, name: 'Ahmed Benali', email: 'ahmed.benali@email.com', assignedDate: '2024-01-20' },
  { id: 2, name: 'Mohamed Alaoui', email: 'm.alaoui@email.com', assignedDate: '2024-02-10' },
  { id: 3, name: 'Fatima Zahra', email: 'fatima.z@email.com', assignedDate: '2024-03-05' },
];

export default function ProProjectDetail() {
  const { id } = useParams();
  const [editingProgress, setEditingProgress] = useState(false);
  const [newProgress, setNewProgress] = useState(projectData.progress);

  return (
    <div className="min-h-screen bg-background">
      <ProNavigation />
      
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/pro/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux projets
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <Button variant="outline">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{projectData.name}</h1>
                <Badge>{projectData.status}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {projectData.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(projectData.startDate).toLocaleDateString('fr-FR')} - {new Date(projectData.endDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progression globale</span>
              <div className="flex items-center gap-2">
                {editingProgress ? (
                  <>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={newProgress}
                      onChange={(e) => setNewProgress(Number(e.target.value))}
                      className="w-20 h-8"
                    />
                    <Button size="sm" onClick={() => setEditingProgress(false)}>Sauver</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingProgress(false)}>Annuler</Button>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-bold">{projectData.progress}%</span>
                    <Button size="sm" variant="ghost" onClick={() => setEditingProgress(true)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Progress value={projectData.progress} className="h-3" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="milestones">Jalons</TabsTrigger>
            <TabsTrigger value="clients">Clients ({assignedClients.length})</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Project Image */}
            <Card className="overflow-hidden">
              <div className="h-80 relative">
                <img
                  src={projectData.image}
                  alt={projectData.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations du projet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="font-medium">{projectData.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Budget</p>
                      <p className="font-medium">{projectData.budget}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Surface</p>
                      <p className="font-medium">{projectData.surface}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clients assignés</span>
                    <span className="font-medium">{assignedClients.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jalons terminés</span>
                    <span className="font-medium">{milestones.filter(m => m.status === 'Terminé').length} / {milestones.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jours restants</span>
                    <span className="font-medium">245</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Jalons du projet</CardTitle>
                  <Button>Ajouter un jalon</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{milestone.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Date prévue: {new Date(milestone.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Badge variant={
                          milestone.status === 'Terminé' ? 'default' :
                          milestone.status === 'En cours' ? 'secondary' : 'outline'
                        }>
                          {milestone.status}
                        </Badge>
                      </div>
                      <Progress value={milestone.progress} className="h-2" />
                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{milestone.progress}%</span>
                        <Button variant="ghost" size="sm">Modifier</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Clients ayant accès</CardTitle>
                    <CardDescription>Gérez les accès clients à ce projet</CardDescription>
                  </div>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assigner un client
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assignedClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between border border-border rounded-lg p-4">
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Assigné le {new Date(client.assignedDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Retirer l'accès</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Documents du projet</CardTitle>
                  <Button>Upload document</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  Aucun document pour le moment
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
