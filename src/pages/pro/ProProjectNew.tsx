import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Upload, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProNavigation } from '@/components/layout/ProNavigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const phases = [
  'Terrassement',
  'Fondations',
  'Structure',
  'Étages supérieurs',
  'Finitions',
  'Livraison',
];

const statuses = [
  'En cours',
  'Retard',
  'Terminé',
];

export default function ProProjectNew() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    phase: '',
    status: 'En cours',
    progress: 0,
    start_date: '',
    end_date: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Erreur',
          description: 'Veuillez sélectionner une image',
          variant: 'destructive',
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: 'Erreur',
          description: 'Vous devez être connecté',
          variant: 'destructive',
        });
        return;
      }

      let imageUrl = '';

      // Upload image if one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Insert project
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert([
          {
            ...formData,
            owner_id: user.id,
            progress: Number(formData.progress),
            image_url: imageUrl,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Auto-generate milestones with dates
      if (newProject && formData.start_date && formData.end_date) {
        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);
        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        const milestones = [
          { id: 'foundation', label: 'Fondations', progress: 10 },
          { id: 'structure', label: 'Structure', progress: 25 },
          { id: 'walls', label: 'Murs et cloisons', progress: 40 },
          { id: 'roof', label: 'Toiture', progress: 55 },
          { id: 'plumbing', label: 'Plomberie', progress: 65 },
          { id: 'electricity', label: 'Électricité', progress: 75 },
          { id: 'finishes', label: 'Finitions', progress: 85 },
          { id: 'exterior', label: 'Aménagements extérieurs', progress: 95 },
          { id: 'delivery', label: 'Livraison', progress: 100 },
        ];

        const milestonesToInsert = milestones.map((milestone, index) => {
          const prevProgress = index > 0 ? milestones[index - 1].progress : 0;
          const progressRange = milestone.progress - prevProgress;
          const daysForMilestone = Math.ceil((totalDays * progressRange) / 100);
          
          const milestoneStartDate = new Date(startDate);
          milestoneStartDate.setDate(milestoneStartDate.getDate() + Math.ceil((totalDays * prevProgress) / 100));
          
          const milestoneEndDate = new Date(milestoneStartDate);
          milestoneEndDate.setDate(milestoneEndDate.getDate() + daysForMilestone);

          return {
            project_id: newProject.id,
            title: milestone.label,
            description: `Étape ${milestone.label}`,
            update_type: 'milestone',
            progress_percentage: 0,
            start_date: milestoneStartDate.toISOString().split('T')[0],
            end_date: milestoneEndDate.toISOString().split('T')[0],
            status: 'on_time',
            created_by: user.id,
          };
        });

        await supabase.from('project_updates').insert(milestonesToInsert);
      }

      toast({
        title: 'Projet créé',
        description: 'Le projet et ses jalons ont été créés avec succès',
      });

      navigate('/pro/projects');
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

  return (
    <div className="min-h-screen bg-background">
      <ProNavigation />
      
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/pro/projects">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux projets
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Nouveau projet</h1>
              <p className="text-muted-foreground mt-1">Créez un nouveau projet immobilier</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Informations du projet</CardTitle>
            <CardDescription>
              Remplissez les informations pour créer votre projet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom du projet */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom du projet *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Résidence Les Jardins"
                />
              </div>

              {/* Localisation */}
              <div className="space-y-2">
                <Label htmlFor="location">Localisation *</Label>
                <Input
                  id="location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ex: Casablanca"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Décrivez votre projet..."
                  rows={4}
                />
              </div>

              {/* Phase et Statut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phase">Phase actuelle *</Label>
                  <Select
                    required
                    value={formData.phase}
                    onValueChange={(value) => setFormData({ ...formData, phase: value })}
                  >
                    <SelectTrigger id="phase">
                      <SelectValue placeholder="Sélectionnez une phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {phases.map((phase) => (
                        <SelectItem key={phase} value={phase}>
                          {phase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Statut *</Label>
                  <Select
                    required
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Sélectionnez un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Progression */}
              <div className="space-y-2">
                <Label htmlFor="progress">Progression (%) *</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Date de début *</Label>
                  <Input
                    id="start_date"
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">Date de fin prévue *</Label>
                  <Input
                    id="end_date"
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              {/* Image upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Image du projet</Label>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Aperçu"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <Label
                      htmlFor="image"
                      className="cursor-pointer text-primary hover:underline"
                    >
                      Cliquez pour sélectionner une image
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <p className="text-sm text-muted-foreground mt-2">
                      PNG, JPG, WEBP jusqu'à 10MB
                    </p>
                  </div>
                )}
              </div>

              {/* Boutons */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Création...' : 'Créer le projet'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/pro/projects')}
                  disabled={loading}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
