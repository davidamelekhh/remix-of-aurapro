import { Navigation } from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { User, Bell, Lock, Mail, Phone, Building2 } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>

          {/* Profile Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center">
              <User className="h-5 w-5 mr-2" strokeWidth={1.5} />
              Informations personnelles
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" defaultValue="Ahmed" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" defaultValue="Mansouri" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" strokeWidth={1.5} />
                  Email
                </Label>
                <Input id="email" type="email" defaultValue="ahmed.mansouri@nexo.ma" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" strokeWidth={1.5} />
                  Téléphone
                </Label>
                <Input id="phone" type="tel" defaultValue="+212 6 12 34 56 78" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" strokeWidth={1.5} />
                  Entreprise
                </Label>
                <Input id="company" defaultValue="Nexo Construction" />
              </div>
            </div>

            <div className="mt-6">
              <Button>Sauvegarder les modifications</Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center">
              <Bell className="h-5 w-5 mr-2" strokeWidth={1.5} />
              Notifications
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notif">Notifications email</Label>
                  <p className="text-sm text-muted-foreground font-light">
                    Recevez des mises à jour par email
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notif">Notifications push</Label>
                  <p className="text-sm text-muted-foreground font-light">
                    Recevez des notifications en temps réel
                  </p>
                </div>
                <Switch
                  id="push-notif"
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notif">Notifications SMS</Label>
                  <p className="text-sm text-muted-foreground font-light">
                    Recevez des alertes importantes par SMS
                  </p>
                </div>
                <Switch
                  id="sms-notif"
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                />
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-6 flex items-center">
              <Lock className="h-5 w-5 mr-2" strokeWidth={1.5} />
              Sécurité
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline">Changer le mot de passe</Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-destructive/20">
            <h2 className="text-lg font-bold text-foreground mb-4">Zone de danger</h2>
            <p className="text-sm text-muted-foreground font-light mb-4">
              Une fois que vous supprimez votre compte, il n'y a pas de retour en arrière.
            </p>
            <Button variant="destructive">
              Supprimer le compte
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
}
