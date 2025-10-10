import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Calendar, MapPin, Edit, Trash2, Plus, Home, UserPlus } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProNavigation } from '@/components/layout/ProNavigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Project = {
  id: string;
  name: string;
  location: string;
  description: string | null;
  progress: number;
  status: string;
  phase: string;
  image_url: string | null;
  start_date: string;
  end_date: string;
};

type PropertyUnit = {
  id: string;
  unit_number: string;
  unit_type: string;
  surface_area: number | null;
  price: number | null;
  status: string;
  floor: string | null;
  description: string | null;
};

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
};

type UnitAssignment = {
  client_id: string;
  unit_id: string;
  client?: Client;
};

export default function ProProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [units, setUnits] = useState<PropertyUnit[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [assignments, setAssignments] = useState<UnitAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnitDialog, setShowUnitDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [unitForm, setUnitForm] = useState({
    unit_number: '',
    unit_type: '',
    surface_area: '',
    price: '',
    status: 'Disponible',
    floor: '',
    description: '',
  });

  useEffect(() => {
    if (id) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Fetch units
      const { data: unitsData, error: unitsError } = await supabase
        .from('property_units')
        .select('*')
        .eq('project_id', id)
        .order('unit_number');

      if (unitsError) throw unitsError;
      setUnits(unitsData || []);

      // Fetch all clients for assignment
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('owner_id', user.id);

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      // Fetch unit assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('project_clients')
        .select(`
          client_id,
          unit_id,
          clients (
            id,
            name,
            email,
            phone,
            status
          )
        `)
        .eq('project_id', id)
        .not('unit_id', 'is', null);

      if (assignmentsError) throw assignmentsError;
      setAssignments(assignmentsData || []);

    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('property_units')
        .insert([
          {
            project_id: id,
            ...unitForm,
            surface_area: unitForm.surface_area ? Number(unitForm.surface_area) : null,
            price: unitForm.price ? Number(unitForm.price) : null,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Lot ajouté',
        description: 'Le lot a été ajouté avec succès',
      });

      setShowUnitDialog(false);
      setUnitForm({
        unit_number: '',
        unit_type: '',
        surface_area: '',
        price: '',
        status: 'Disponible',
        floor: '',
        description: '',
      });
      fetchProjectData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lot ?')) return;

    try {
      const { error } = await supabase
        .from('property_units')
        .delete()
        .eq('id', unitId);

      if (error) throw error;

      toast({
        title: 'Lot supprimé',
        description: 'Le lot a été supprimé avec succès',
      });

      fetchProjectData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAssignClient = async () => {
    if (!selectedClientId || !selectedUnitId) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un client',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Check if assignment already exists
      const { data: existing } = await supabase
        .from('project_clients')
        .select('*')
        .eq('project_id', id)
        .eq('client_id', selectedClientId)
        .eq('unit_id', selectedUnitId)
        .single();

      if (existing) {
        toast({
          title: 'Erreur',
          description: 'Ce client est déjà assigné à ce lot',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('project_clients')
        .insert([
          {
            project_id: id,
            client_id: selectedClientId,
            unit_id: selectedUnitId,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Client assigné',
        description: 'Le client a été assigné au lot avec succès',
      });

      setShowAssignDialog(false);
      setSelectedClientId('');
      setSelectedUnitId('');
      fetchProjectData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUnassignClient = async (clientId: string, unitId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir désassigner ce client ?')) return;

    try {
      const { error } = await supabase
        .from('project_clients')
        .delete()
        .eq('project_id', id)
        .eq('client_id', clientId)
        .eq('unit_id', unitId);

      if (error) throw error;

      toast({
        title: 'Client désassigné',
        description: 'Le client a été désassigné du lot',
      });

      fetchProjectData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getUnitAssignments = (unitId: string) => {
    return assignments.filter(a => a.unit_id === unitId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ProNavigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <ProNavigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-muted-foreground">Projet non trouvé</p>
            <Link to="/pro/projects">
              <Button className="mt-4">Retour aux projets</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <Badge>{project.status}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {project.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(project.start_date).toLocaleDateString('fr-FR')} - {new Date(project.end_date).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progression globale</span>
              <span className="text-sm font-bold">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="units">Lots ({units.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Image */}
            {project.image_url && (
              <Card>
                <CardContent className="p-0">
                  <img
                    src={project.image_url}
                    alt={project.name}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Détails du projet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Phase actuelle</Label>
                  <p className="font-medium">{project.phase}</p>
                </div>
                {project.description && (
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="font-medium">{project.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="units" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Lots du projet</CardTitle>
                    <CardDescription>Gérez les lots à vendre de ce projet</CardDescription>
                  </div>
                  <Dialog open={showUnitDialog} onOpenChange={setShowUnitDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter un lot
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Ajouter un lot</DialogTitle>
                        <DialogDescription>
                          Créez un nouveau lot pour ce projet
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddUnit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="unit_number">Numéro du lot *</Label>
                            <Input
                              id="unit_number"
                              required
                              value={unitForm.unit_number}
                              onChange={(e) => setUnitForm({ ...unitForm, unit_number: e.target.value })}
                              placeholder="Ex: A-101"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="unit_type">Type *</Label>
                            <Select
                              value={unitForm.unit_type}
                              onValueChange={(value) => setUnitForm({ ...unitForm, unit_type: value })}
                            >
                              <SelectTrigger id="unit_type">
                                <SelectValue placeholder="Sélectionnez" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Appartement">Appartement</SelectItem>
                                <SelectItem value="Villa">Villa</SelectItem>
                                <SelectItem value="Studio">Studio</SelectItem>
                                <SelectItem value="Duplex">Duplex</SelectItem>
                                <SelectItem value="Commerce">Commerce</SelectItem>
                                <SelectItem value="Bureau">Bureau</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="surface_area">Surface (m²)</Label>
                            <Input
                              id="surface_area"
                              type="number"
                              value={unitForm.surface_area}
                              onChange={(e) => setUnitForm({ ...unitForm, surface_area: e.target.value })}
                              placeholder="120"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="price">Prix (MAD)</Label>
                            <Input
                              id="price"
                              type="number"
                              value={unitForm.price}
                              onChange={(e) => setUnitForm({ ...unitForm, price: e.target.value })}
                              placeholder="1500000"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="floor">Étage</Label>
                            <Input
                              id="floor"
                              value={unitForm.floor}
                              onChange={(e) => setUnitForm({ ...unitForm, floor: e.target.value })}
                              placeholder="RDC, 1er, 2ème..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Statut *</Label>
                            <Select
                              value={unitForm.status}
                              onValueChange={(value) => setUnitForm({ ...unitForm, status: value })}
                            >
                              <SelectTrigger id="status">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Disponible">Disponible</SelectItem>
                                <SelectItem value="Réservé">Réservé</SelectItem>
                                <SelectItem value="Vendu">Vendu</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={unitForm.description}
                            onChange={(e) => setUnitForm({ ...unitForm, description: e.target.value })}
                            placeholder="Détails du lot..."
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button type="submit" className="flex-1">Ajouter</Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowUnitDialog(false)}
                          >
                            Annuler
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {units.length === 0 ? (
                  <div className="text-center py-12">
                    <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun lot pour ce projet</p>
                    <Button className="mt-4" onClick={() => setShowUnitDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter le premier lot
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Numéro</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Surface</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Étage</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Client assigné</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {units.map((unit) => {
                        const unitAssignments = getUnitAssignments(unit.id);
                        return (
                          <TableRow key={unit.id}>
                            <TableCell className="font-medium">{unit.unit_number}</TableCell>
                            <TableCell>{unit.unit_type}</TableCell>
                            <TableCell>{unit.surface_area ? `${unit.surface_area} m²` : '-'}</TableCell>
                            <TableCell>{unit.price ? `${unit.price.toLocaleString()} MAD` : '-'}</TableCell>
                            <TableCell>{unit.floor || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={unit.status === 'Vendu' ? 'default' : unit.status === 'Réservé' ? 'secondary' : 'outline'}>
                                {unit.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {unitAssignments.length > 0 ? (
                                <div className="space-y-1">
                                  {unitAssignments.map((assignment) => (
                                    <div key={assignment.client_id} className="flex items-center justify-between gap-2">
                                      <span className="text-sm">{(assignment.client as any)?.name}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleUnassignClient(assignment.client_id, assignment.unit_id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUnitId(unit.id);
                                    setShowAssignDialog(true);
                                  }}
                                >
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Assigner
                                </Button>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUnit(unit.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Assign Client Dialog */}
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assigner un client</DialogTitle>
              <DialogDescription>
                Sélectionnez un client à assigner à ce lot
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                {clients.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Vous n'avez pas encore de clients
                    </p>
                    <Link to="/pro/clients/new">
                      <Button variant="outline" size="sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Créer un client
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Select
                    value={selectedClientId}
                    onValueChange={setSelectedClientId}
                  >
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Sélectionnez un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} - {client.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={handleAssignClient} 
                className="flex-1"
                disabled={!selectedClientId || clients.length === 0}
              >
                Assigner
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAssignDialog(false);
                  setSelectedClientId('');
                }}
              >
                Annuler
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
