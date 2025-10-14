import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Building, ArrowLeft } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { Link } from 'react-router-dom';

export default function ProAuth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { role, loading: roleLoading } = useUserRole();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
    phone: ''
  });

  // Redirect or logout based on role
  useEffect(() => {
    if (!roleLoading && role) {
      if (role === 'pro') {
        navigate('/pro/dashboard');
      } else if (role === 'client') {
        // Disconnect client if trying to access pro space
        supabase.auth.signOut().then(() => {
          toast({
            title: 'Déconnexion requise',
            description: 'Vous étiez connecté comme client. Connectez-vous avec un compte promoteur.',
            variant: 'destructive',
          });
        });
      }
    }
  }, [role, roleLoading, navigate, toast]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.email.trim() || !formData.password) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      });
      return;
    }

    if (!isLogin && (!formData.fullName.trim() || !formData.companyName.trim())) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs obligatoires',
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
      if (isLogin) {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });

        if (error) {
          if (error.message.includes('Invalid login')) {
            throw new Error('Email ou mot de passe incorrect');
          }
          throw error;
        }
        
        if (!authData.user) throw new Error('Erreur de connexion');

        // Verify pro role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authData.user.id)
          .maybeSingle();

        if (roleError || !roleData || roleData.role !== 'pro') {
          await supabase.auth.signOut();
          throw new Error('Accès refusé. Cet espace est réservé aux promoteurs.');
        }

        toast({
          title: 'Connexion réussie',
          description: 'Bienvenue dans votre espace promoteur',
        });

        navigate('/pro/dashboard');
      } else {
        const { data: authData, error } = await supabase.auth.signUp({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/pro/dashboard`,
            data: {
              full_name: formData.fullName.trim(),
              company_name: formData.companyName.trim(),
              phone: formData.phone.trim(),
            }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            throw new Error('Un compte avec cet email existe déjà');
          }
          throw error;
        }

        if (!authData.user) {
          throw new Error('Erreur lors de la création du compte');
        }

        toast({
          title: 'Inscription réussie',
          description: 'Votre compte promoteur a été créé avec succès. Connexion automatique...',
        });

        // Auto login after registration
        navigate('/pro/dashboard');
      }
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
              <Building className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">
              {isLogin ? 'Connexion Promoteur' : 'Inscription Promoteur'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Connectez-vous à votre espace promoteur' 
                : 'Créez votre compte promoteur immobilier'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                    <Input
                      id="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Votre société"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Chargement...' : (isLogin ? 'Se connecter' : "S'inscrire")}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
