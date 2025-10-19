import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const earlyAdopterSchema = z.object({
  email: z.string().trim().email({ message: "Adresse email invalide" }).max(255),
  first_name: z.string().trim().min(1, { message: "Prénom requis" }).max(100),
  last_name: z.string().trim().min(1, { message: "Nom requis" }).max(100),
  phone: z.string().trim().min(1, { message: "Téléphone requis" }).max(50),
  company: z.string().trim().max(200).optional(),
  project_count: z.string().min(1, { message: "Nombre de projets requis" }),
  language: z.enum(['fr', 'en', 'es', 'ar'])
});

interface EarlyAdopterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialEmail: string;
  language: 'fr' | 'en' | 'es' | 'ar';
}

export function EarlyAdopterDialog({ open, onOpenChange, initialEmail, language }: EarlyAdopterDialogProps) {
  const [formData, setFormData] = useState({
    email: initialEmail,
    first_name: "",
    last_name: "",
    phone: "",
    company: "",
    project_count: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Validate input
      const validated = earlyAdopterSchema.parse({
        ...formData,
        language
      });

      const { error } = await supabase
        .from('waitlist')
        .insert([{
          email: validated.email,
          first_name: validated.first_name,
          last_name: validated.last_name,
          phone: validated.phone,
          company: validated.company || null,
          project_count: validated.project_count,
          language: validated.language
        }]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Déjà inscrit",
            description: "Cet email est déjà sur la liste d'attente.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Inscription réussie !",
        description: "Vous êtes maintenant sur la liste d'attente. Nous vous contacterons bientôt."
      });

      // Reset form and close dialog
      setFormData({
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        company: "",
        project_count: "",
      });
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation échouée",
          description: error.errors[0].message,
          variant: "destructive"
        });
      } else {
        console.error('Error joining waitlist:', error);
        toast({
          title: "Erreur",
          description: "Une erreur s'est produite. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Rejoignez nos Early Adopters</DialogTitle>
          <DialogDescription>
            Complétez votre inscription pour bénéficier de -50% sur les 3 premiers mois
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                placeholder="Jean"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                placeholder="Dupont"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="jean.dupont@exemple.fr"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+33 6 12 34 56 78"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Entreprise</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Nom de votre entreprise"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_count">Nombre de projets actifs *</Label>
            <Select
              value={formData.project_count}
              onValueChange={(value) => setFormData(prev => ({ ...prev, project_count: value }))}
              required
            >
              <SelectTrigger id="project_count">
                <SelectValue placeholder="Sélectionnez" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">1-3 projets</SelectItem>
                <SelectItem value="4-10">4-10 projets</SelectItem>
                <SelectItem value="11-20">11-20 projets</SelectItem>
                <SelectItem value="20+">Plus de 20 projets</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Inscription..." : "Confirmer l'inscription"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
