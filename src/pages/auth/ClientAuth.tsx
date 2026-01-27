import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { signIn } from '@/lib/api';

export default function ClientAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.email.trim() || !formData.password) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Erreur',
        description: 'Le mot de passe doit contenir au moins 6 caractères',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement actual authentication with your backend
      const { user, error } = await signIn({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (error) {
        throw new Error(error);
      }

      toast({
        title: 'Connexion réussie',
        description: 'Bienvenue dans votre espace client',
      });

      navigate('/client/dashboard');
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au portail
          </Button>
        </Link>
        
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <User className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Connexion Client</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à vos projets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre.email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Votre mot de passe"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>Pas encore de compte ?</p>
              <p className="mt-1">Contactez votre promoteur pour obtenir vos identifiants</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
