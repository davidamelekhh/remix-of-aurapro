import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, User } from 'lucide-react';

export default function Portal() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <Building className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Plateforme Immobilière
          </h1>
          <p className="text-muted-foreground text-lg">
            Choisissez votre espace de connexion
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Espace Promoteur */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building className="h-10 w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Espace Promoteur</CardTitle>
              <CardDescription className="text-base">
                Gérez vos projets immobiliers et vos clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/auth/promoteur" className="block">
                <Button className="w-full" size="lg">
                  Accéder à l'espace Pro
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Espace Client */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Espace Client</CardTitle>
              <CardDescription className="text-base">
                Suivez l'avancement de vos projets immobiliers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/auth/client" className="block">
                <Button className="w-full" size="lg">
                  Accéder à mon espace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
