import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ProNavigation } from '@/components/layout/ProNavigation';
import { User, Building, Mail, Phone, Lock, Save, CreditCard, Crown } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { getUserProfile, updateUserProfile, updatePassword } from '@/lib/api';

export default function ProSettings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    company_name: '',
    phone: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // TODO: Replace with actual authenticated user ID from your backend
      const mockUserId = 'mock-user-id';
      const profile = await getUserProfile(mockUserId);

      if (profile) {
        setProfileForm({
          full_name: profile.full_name || '',
          email: profile.email || '',
          company_name: profile.company_name || '',
          phone: profile.phone || '',
        });
      }
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: Replace with actual authenticated user ID from your backend
      const mockUserId = 'mock-user-id';

      const { error } = await updateUserProfile(mockUserId, {
        full_name: profileForm.full_name,
        company_name: profileForm.company_name,
        phone: profileForm.phone,
      });

      if (error) throw new Error(error);

      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été enregistrées avec succès',
      });

      fetchProfile();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Erreur',
        description: 'Les mots de passe ne correspondent pas',
        variant: 'destructive',
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: 'Erreur',
        description: 'Le mot de passe doit contenir au moins 6 caractères',
        variant: 'destructive',
      });
      return;
    }

    setChangingPassword(true);

    try {
      const { error } = await updatePassword(passwordForm.newPassword);

      if (error) throw new Error(error);

      toast({
        title: 'Mot de passe modifié',
        description: 'Votre mot de passe a été mis à jour avec succès',
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ProNavigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProNavigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations du profil
              </CardTitle>
              <CardDescription>
                Modifiez vos informations personnelles et professionnelles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">
                    <User className="h-4 w-4 inline mr-2" />
                    Nom complet *
                  </Label>
                  <Input
                    id="full_name"
                    required
                    value={profileForm.full_name}
                    onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                    placeholder="Jean Dupont"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_name">
                    <Building className="h-4 w-4 inline mr-2" />
                    Nom de l'entreprise *
                  </Label>
                  <Input
                    id="company_name"
                    required
                    value={profileForm.company_name}
                    onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                    placeholder="Ma Société"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    placeholder="email@exemple.com"
                  />
                  <p className="text-sm text-muted-foreground">
                    Un email de confirmation sera envoyé si vous changez votre adresse
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Téléphone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <Button type="submit" disabled={saving} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Subscription Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Plan d'abonnement
              </CardTitle>
              <CardDescription>
                Gérez votre abonnement et vos paiements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Plan Gratuit</h3>
                    <Badge variant="secondary">Actuel</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Accès aux fonctionnalités de base
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">0€</p>
                  <p className="text-sm text-muted-foreground">/mois</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold">Plan Premium</h4>
                <div className="p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-primary/10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">Plan Pro</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Accès à toutes les fonctionnalités avancées
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">29€</p>
                      <p className="text-sm text-muted-foreground">/mois</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 mb-4 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Projets illimités
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Clients et parties prenantes illimités
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Stockage de documents étendu
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Analyses et rapports avancés
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Support prioritaire
                    </li>
                  </ul>

                  <Button className="w-full">
                    <Crown className="mr-2 h-4 w-4" />
                    Passer au plan Pro
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Change */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Modifier le mot de passe
              </CardTitle>
              <CardDescription>
                Changez votre mot de passe pour sécuriser votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new_password">Nouveau mot de passe *</Label>
                  <Input
                    id="new_password"
                    type="password"
                    required
                    minLength={6}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Minimum 6 caractères"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password">Confirmer le mot de passe *</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    required
                    minLength={6}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Retapez votre mot de passe"
                  />
                </div>

                <Button type="submit" disabled={changingPassword} className="w-full">
                  <Lock className="mr-2 h-4 w-4" />
                  {changingPassword ? 'Modification...' : 'Changer le mot de passe'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
