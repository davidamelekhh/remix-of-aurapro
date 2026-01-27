import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { UserCog } from 'lucide-react';
import { getStakeholders, getMilestoneStakeholders, assignStakeholderToMilestone, removeStakeholderFromMilestone } from '@/lib/api';

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  company: string | null;
}

interface StakeholderAssignDialogProps {
  milestoneId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssigned?: () => void;
}

export function StakeholderAssignDialog({ milestoneId, open, onOpenChange, onAssigned }: StakeholderAssignDialogProps) {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [selectedStakeholders, setSelectedStakeholders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchStakeholders();
      fetchAssignments();
    }
  }, [open, milestoneId]);

  const fetchStakeholders = async () => {
    try {
      // TODO: Get actual user ID from your auth system
      const userId = 'mock-user-id';
      const data = await getStakeholders(userId);
      setStakeholders(data);
    } catch (error) {
      console.error('Error fetching stakeholders:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const data = await getMilestoneStakeholders(milestoneId);
      setSelectedStakeholders(new Set(data.map(a => a.stakeholder_id)));
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleToggleStakeholder = (stakeholderId: string) => {
    const newSelected = new Set(selectedStakeholders);
    if (newSelected.has(stakeholderId)) {
      newSelected.delete(stakeholderId);
    } else {
      newSelected.add(stakeholderId);
    }
    setSelectedStakeholders(newSelected);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Get current assignments
      const currentAssignments = await getMilestoneStakeholders(milestoneId);
      const currentIds = new Set(currentAssignments.map(a => a.stakeholder_id));

      // Find assignments to add and remove
      const toAdd = Array.from(selectedStakeholders).filter(id => !currentIds.has(id));
      const toRemove = Array.from(currentIds).filter(id => !selectedStakeholders.has(id));

      // Add new assignments
      for (const stakeholderId of toAdd) {
        const result = await assignStakeholderToMilestone(milestoneId, stakeholderId);
        if (result.error) {
          throw new Error(result.error);
        }
      }

      // Remove unselected assignments
      for (const stakeholderId of toRemove) {
        const result = await removeStakeholderFromMilestone(milestoneId, stakeholderId);
        if (result.error) {
          throw new Error(result.error);
        }
      }

      toast({
        title: 'Succès',
        description: 'Intervenants assignés avec succès'
      });

      onAssigned?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving assignments:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'assigner les intervenants',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assigner des intervenants</DialogTitle>
          <DialogDescription>
            Sélectionnez les intervenants à assigner à cette étape
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {stakeholders.length === 0 ? (
            <div className="text-center py-8">
              <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Aucun intervenant disponible. Créez-en d'abord dans la section Intervenants.
              </p>
            </div>
          ) : (
            stakeholders.map((stakeholder) => (
              <div key={stakeholder.id} className="flex items-center space-x-2">
                <Checkbox
                  id={stakeholder.id}
                  checked={selectedStakeholders.has(stakeholder.id)}
                  onCheckedChange={() => handleToggleStakeholder(stakeholder.id)}
                />
                <label
                  htmlFor={stakeholder.id}
                  className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  <div>
                    <div>{stakeholder.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {stakeholder.role}
                      {stakeholder.company && ` - ${stakeholder.company}`}
                    </div>
                  </div>
                </label>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading || stakeholders.length === 0}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
