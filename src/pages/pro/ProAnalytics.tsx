import { useEffect, useState } from 'react';
import { ProNavigation } from '@/components/layout/ProNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { BarChart3, Clock, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { format, isAfter, isBefore, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AnalyticsData {
  totalProjects: number;
  avgProgress: number;
  delayedMilestones: number;
  avgDelayPerStage: number;
  unitsDelivered: number;
  unitsSold: number;
  weeklyActivity: {
    messages: number;
    documents: number;
  };
}

export default function ProAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalProjects: 0,
    avgProgress: 0,
    delayedMilestones: 0,
    avgDelayPerStage: 0,
    unitsDelivered: 0,
    unitsSold: 0,
    weeklyActivity: { messages: 0, documents: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch projects data
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id);

      // Fetch milestones
      const { data: milestones } = await supabase
        .from('project_updates')
        .select('*')
        .eq('created_by', user.id)
        .eq('update_type', 'milestone');

      // Fetch units
      const { data: units } = await supabase
        .from('property_units')
        .select('*, projects!inner(owner_id)')
        .eq('projects.owner_id', user.id);

      // Calculate weekly activity
      const weekAgo = subDays(new Date(), 7);
      const { data: messages } = await supabase
        .from('project_messages')
        .select('*, projects!inner(owner_id)')
        .eq('projects.owner_id', user.id)
        .gte('created_at', weekAgo.toISOString());

      const { data: documents } = await supabase
        .from('project_documents')
        .select('*, projects!inner(owner_id)')
        .eq('projects.owner_id', user.id)
        .gte('created_at', weekAgo.toISOString());

      // Calculate analytics
      const totalProjects = projects?.length || 0;
      const avgProgress = projects?.reduce((sum, p) => sum + p.progress, 0) / (totalProjects || 1);

      const delayedMilestones = milestones?.filter(m => {
        if (!m.end_date) return false;
        return isAfter(new Date(), new Date(m.end_date)) && m.progress_percentage < 100;
      }).length || 0;

      const milestonesWithDelay = milestones?.filter(m => {
        if (!m.end_date || !m.start_date) return false;
        return isAfter(new Date(), new Date(m.end_date)) && m.progress_percentage < 100;
      }) || [];

      const avgDelayPerStage = milestonesWithDelay.length > 0
        ? milestonesWithDelay.reduce((sum, m) => {
            const delay = Math.floor((new Date().getTime() - new Date(m.end_date!).getTime()) / (1000 * 60 * 60 * 24));
            return sum + delay;
          }, 0) / milestonesWithDelay.length
        : 0;

      const unitsSold = units?.filter(u => u.status === 'Vendu').length || 0;
      const unitsDelivered = units?.filter(u => u.status === 'Livré').length || 0;

      setAnalytics({
        totalProjects,
        avgProgress: Math.round(avgProgress),
        delayedMilestones,
        avgDelayPerStage: Math.round(avgDelayPerStage),
        unitsSold,
        unitsDelivered,
        weeklyActivity: {
          messages: messages?.length || 0,
          documents: documents?.length || 0
        }
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <ProNavigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-2">Vue d'ensemble de vos projets et performances</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Chargement des analytics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Average Progress */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progression Moyenne</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.avgProgress}%</div>
                <p className="text-xs text-muted-foreground">
                  Sur {analytics.totalProjects} projet{analytics.totalProjects > 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            {/* Delayed Milestones */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Jalons en Retard</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.delayedMilestones}</div>
                <p className="text-xs text-muted-foreground">
                  Délai moyen: {analytics.avgDelayPerStage} jour{analytics.avgDelayPerStage > 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            {/* Units Status */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Biens Vendus</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.unitsSold}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics.unitsDelivered} livré{analytics.unitsDelivered > 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>

            {/* Weekly Messages */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages (7 jours)</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.weeklyActivity.messages}</div>
                <p className="text-xs text-muted-foreground">Activité hebdomadaire</p>
              </CardContent>
            </Card>

            {/* Weekly Documents */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents (7 jours)</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.weeklyActivity.documents}</div>
                <p className="text-xs text-muted-foreground">Documents ajoutés</p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}