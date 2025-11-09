import { useState } from 'react';
import { Check, Plus, UserCog, Edit, ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type MilestonesListProps = {
  projectMilestones: any[];
  projectConfig: any;
  projectId: string;
  onMilestoneClick: (milestoneId: string) => void;
  onStakeholderClick: (milestoneId: string) => void;
  onRefresh: () => void;
};

export function MilestonesList({
  projectMilestones,
  projectConfig,
  projectId,
  onMilestoneClick,
  onStakeholderClick,
  onRefresh,
}: MilestonesListProps) {
  const { toast } = useToast();
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set(['structural_work']));

  const toggleExpanded = (milestoneKey: string) => {
    const newExpanded = new Set(expandedMilestones);
    if (newExpanded.has(milestoneKey)) {
      newExpanded.delete(milestoneKey);
    } else {
      newExpanded.add(milestoneKey);
    }
    setExpandedMilestones(newExpanded);
  };

  const handleConditionChange = async (conditionType: string, value: boolean) => {
    try {
      const updateData = conditionType === 'requires_destruction_authorization'
        ? { requires_destruction_authorization: value }
        : { has_existing_building: value };

      const { error } = await supabase
        .from('project_configurations')
        .update(updateData)
        .eq('project_id', projectId);

      if (error) throw error;

      // Update milestone enabled status
      const milestoneKey = conditionType === 'requires_destruction_authorization'
        ? 'destruction_authorization_launch'
        : 'existing_building_destruction';

      await supabase
        .from('project_milestones')
        .update({ is_enabled: value })
        .eq('project_id', projectId)
        .eq('milestone_key', milestoneKey);

      toast({
        title: 'Configuration mise à jour',
        description: 'Les étapes ont été mises à jour'
      });

      onRefresh();
    } catch (error) {
      console.error('Error updating condition:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour la configuration',
        variant: 'destructive'
      });
    }
  };

  // Filter out sub-milestones and group them
  const mainMilestones = projectMilestones.filter(m => !m.parent_milestone_id);
  const subMilestones = projectMilestones.filter(m => m.parent_milestone_id);

  const getSubMilestones = (parentId: string) => {
    return subMilestones.filter(sm => sm.parent_milestone_id === parentId);
  };

  console.log('MilestonesList - projectMilestones:', projectMilestones);
  console.log('MilestonesList - projectConfig:', projectConfig);

  return (
    <div className="space-y-4">
      {projectMilestones.length === 0 && (
        <div className="p-4 border rounded-lg bg-muted/30 text-center">
          <p className="text-sm text-muted-foreground">
            Aucune étape trouvée. Veuillez rafraîchir la page pour initialiser les étapes du projet.
          </p>
        </div>
      )}
      
      {projectConfig && (
        <div className="mb-6 p-4 border rounded-lg bg-secondary/20 space-y-4">
          <h4 className="font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Configuration du projet
          </h4>
          
          <div className="space-y-2">
            <Label>Autorisation de destruction requise ?</Label>
            <Select
              value={projectConfig.requires_destruction_authorization ? 'yes' : 'no'}
              onValueChange={(value) => handleConditionChange('requires_destruction_authorization', value === 'yes')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Bien existant à détruire ?</Label>
            <Select
              value={projectConfig.has_existing_building ? 'yes' : 'no'}
              onValueChange={(value) => handleConditionChange('has_existing_building', value === 'yes')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Oui</SelectItem>
                <SelectItem value="no">Non</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {mainMilestones.map((milestone, index) => {
          const isCompleted = milestone.status === 'completed';
          const isDisabled = milestone.is_conditional && !milestone.is_enabled;
          const hasSubMilestones = getSubMilestones(milestone.id).length > 0;
          const isExpanded = expandedMilestones.has(milestone.milestone_key);
          const subs = getSubMilestones(milestone.id);

          return (
            <div key={milestone.id}>
              <div className={`flex items-start gap-4 ${isDisabled ? 'opacity-40' : ''}`}>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => {
                      if (!isCompleted && !isDisabled) {
                        onMilestoneClick(milestone.id);
                      }
                    }}
                    disabled={isCompleted || isDisabled}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted 
                        ? 'bg-success text-success-foreground cursor-default' 
                        : isDisabled
                        ? 'bg-muted/50 text-muted-foreground cursor-not-allowed'
                        : 'bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground cursor-pointer'
                    }`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </button>
                  {index < mainMilestones.length - 1 && (
                    <div className={`w-0.5 h-16 ${isCompleted ? 'bg-success' : 'bg-border'}`} />
                  )}
                </div>
                
                <div className="flex-1 pb-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {hasSubMilestones && (
                          <button
                            onClick={() => toggleExpanded(milestone.milestone_key)}
                            className="p-1 hover:bg-muted rounded"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        <p className={`font-medium text-lg ${isCompleted ? 'text-foreground' : isDisabled ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {milestone.label}
                        </p>
                        {isDisabled && (
                          <Badge variant="outline" className="text-xs">Désactivé</Badge>
                        )}
                      </div>
                      
                      {!isDisabled && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onStakeholderClick(milestone.id)}
                        >
                          <UserCog className="h-4 w-4 mr-2" />
                          Intervenants
                        </Button>
                      )}
                    </div>
                    <Badge variant={isCompleted ? 'default' : 'outline'}>
                      {milestone.progress_percentage}%
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Sub-milestones */}
              {hasSubMilestones && isExpanded && (
                <div className="ml-14 mt-2 space-y-2 border-l-2 border-border pl-4">
                  {subs.map((sub) => {
                    const subCompleted = sub.status === 'completed';
                    return (
                      <div key={sub.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              if (!subCompleted) {
                                onMilestoneClick(sub.id);
                              }
                            }}
                            disabled={subCompleted}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                              subCompleted 
                                ? 'bg-success text-success-foreground' 
                                : 'bg-muted hover:bg-primary hover:text-primary-foreground cursor-pointer'
                            }`}
                          >
                            {subCompleted ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </button>
                          <span className={`font-medium ${subCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {sub.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onStakeholderClick(sub.id)}
                          >
                            <UserCog className="h-3 w-3" />
                          </Button>
                          <Badge variant={subCompleted ? 'default' : 'outline'} className="text-xs">
                            {sub.progress_percentage}%
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
