import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ProNavigation } from '@/components/layout/ProNavigation';
import { Settings, User, Building, Mail, Phone, Lock, Save } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/promoteur');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfileForm({
        full_name: profile.full_name || '',
        email: profile.email || user.email || '',
        company_name: profile.company_name || '',
        phone: profile.phone || '',
      });
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: profileForm.full_name,
          company_name: profileForm.company_name,
          phone: profileForm.phone,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update email if changed
      if (profileForm.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileForm.email,
        });

        if (emailError) throw emailError;

        toast({
          title: 'Email mis à jour',
          description: 'Un email de confirmation a été envoyé à votre nouvelle adresse',
        });
      }

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
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

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