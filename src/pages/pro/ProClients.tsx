import { useState } from 'react';
import { UserPlus, Search, Mail, Phone, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProNavigation } from '@/components/layout/ProNavigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const clients = [
  { id: 1, name: 'Ahmed Benali', email: 'ahmed.benali@email.com', phone: '+212 6 12 34 56 78', projects: ['Résidence Les Jardins'], status: 'Actif', joinDate: '2024-01-15' },
  { id: 2, name: 'Fatima Zahra', email: 'fatima.z@email.com', phone: '+212 6 98 76 54 32', projects: ['Villa Moderne Atlas'], status: 'Actif', joinDate: '2024-02-20' },
  { id: 3, name: 'Mohamed Alaoui', email: 'm.alaoui@email.com', phone: '+212 6 11 22 33 44', projects: ['Complexe Marina Bay', 'Résidence Les Jardins'], status: 'Actif', joinDate: '2023-11-10' },
  { id: 4, name: 'Samira El Fassi', email: 'samira.ef@email.com', phone: '+212 6 55 66 77 88', projects: ['Appartements Ocean View'], status: 'Actif', joinDate: '2024-03-05' },
  { id: 5, name: 'Youssef Tazi', email: 'y.tazi@email.com', phone: '+212 6 99 88 77 66', projects: ['Résidence Palm Garden'], status: 'En attente', joinDate: '2024-04-12' },
];

export default function ProClients() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <ProNavigation />
      
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Gestion des clients</h1>
              <p className="text-muted-foreground mt-1">Gérez vos clients et leurs accès projets</p>
            </div>
            <Button size="lg">
              <UserPlus className="mr-2 h-4 w-4" />
              Nouveau client
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total clients</CardDescription>
              <CardTitle className="text-3xl">{clients.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Clients actifs</CardDescription>
              <CardTitle className="text-3xl">{clients.filter(c => c.status === 'Actif').length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>En attente</CardDescription>
              <CardTitle className="text-3xl">{clients.filter(c => c.status === 'En attente').length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Clients Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Projets</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date d'inscription</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3 w-3 mr-2" />
                          {client.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 mr-2" />
                          {client.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {client.projects.map((project, idx) => (
                          <div key={idx} className="flex items-center text-sm">
                            <Building2 className="h-3 w-3 mr-2 text-primary" />
                            {project}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'Actif' ? 'default' : 'secondary'}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(client.joinDate).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Gérer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
