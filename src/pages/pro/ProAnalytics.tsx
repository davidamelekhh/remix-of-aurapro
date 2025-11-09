import { useEffect, useState, useRef } from 'react';
import { ProNavigation } from '@/components/layout/ProNavigation';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, DollarSign, CheckCircle2, AlertCircle, Sparkles, MapPin, BarChart3 } from 'lucide-react';
import { isAfter, subDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface AnalyticsData {
  totalProjects: number;
  avgProgress: number;
  delayedMilestones: number;
  avgDelayPerStage: number;
  unitsDelivered: number;
  unitsSold: number;
  totalRevenue: number;
  paidRevenue: number;
  weeklyActivity: {
    messages: number;
    documents: number;
  };
}

interface Project {
  id: string;
  name: string;
  progress: number;
  status: string;
  location: string;
  estimated_revenue: number;
}

export default function ProAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalProjects: 0,
    avgProgress: 0,
    delayedMilestones: 0,
    avgDelayPerStage: 0,
    unitsDelivered: 0,
    unitsSold: 0,
    totalRevenue: 0,
    paidRevenue: 0,
    weeklyActivity: { messages: 0, documents: 0 }
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (!mapContainer.current || projects.length === 0) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTgycmNyNWswMzA2MmtzNmI1cHU4dXN1In0.JCL7LmLhLQo_NxABBJm5Bw';
    
    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-7.5898, 33.5731], // Morocco center
        zoom: 5,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    // Add markers for projects
    projects.forEach((project) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      
      if (project.progress >= 90) {
        el.style.backgroundColor = 'hsl(var(--success))';
      } else if (project.progress >= 50) {
        el.style.backgroundColor = 'hsl(var(--primary))';
      } else if (project.progress >= 25) {
        el.style.backgroundColor = 'hsl(var(--muted-foreground))';
      } else {
        el.style.backgroundColor = 'hsl(var(--destructive))';
      }

      // Random coordinates around Morocco for demo
      const lat = 33.5731 + (Math.random() - 0.5) * 4;
      const lng = -7.5898 + (Math.random() - 0.5) * 4;

      new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(map.current!);

      el.addEventListener('click', () => {
        setSelectedProject(project.id);
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [projects]);

  const fetchAnalytics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch projects data
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', user.id);
      
      setProjects(projectsData?.map(p => ({
        id: p.id,
        name: p.name,
        progress: p.progress,
        status: p.status,
        location: p.location,
        estimated_revenue: p.estimated_revenue || 0
      })) || []);

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

      // Fetch payments
      const { data: payments } = await supabase
        .from('payment_schedules')
        .select('*, projects!inner(owner_id)')
        .eq('projects.owner_id', user.id);

      // Calculate analytics
      const totalProjects = projectsData?.length || 0;
      const avgProgress = projectsData?.reduce((sum, p) => sum + p.progress, 0) / (totalProjects || 1);

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

      // Calculate revenue
      const totalRevenue = projectsData?.reduce((sum, p) => sum + (p.estimated_revenue || 0), 0) || 0;
      const paidRevenue = payments?.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

      setAnalytics({
        totalProjects,
        avgProgress: Math.round(avgProgress),
        delayedMilestones,
        avgDelayPerStage: Math.round(avgDelayPerStage),
        unitsSold,
        unitsDelivered,
        totalRevenue,
        paidRevenue,
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

  const getStatusColor = (progress: number) => {
    if (progress >= 90) return 'bg-success/20 border-success/40';
    if (progress >= 50) return 'bg-primary/20 border-primary/40';
    if (progress >= 25) return 'bg-muted border-muted-foreground/20';
    return 'bg-destructive/20 border-destructive/40';
  };

  const aiInsights = [
    {
      title: "Risque de retard détecté",
      description: "Le projet Villa Moderne présente 15 jours de retard. Action recommandée: coordination des prestataires.",
      icon: AlertCircle,
      color: "text-destructive"
    },
    {
      title: "Opportunité commerciale",
      description: "3 unités similaires vendues récemment dans la zone. Ajustement de prix suggéré: +8%.",
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Optimisation budgétaire",
      description: "Potentiel d'économie de 12% sur les matériaux en consolidant les commandes de 2 projets.",
      icon: DollarSign,
      color: "text-primary"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ProNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* CA Estimé */}
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">CA Total Estimé</p>
                  </div>
                  <div className="text-2xl font-semibold text-foreground">
                    {(analytics.totalRevenue / 1000000).toFixed(2)}M
                  </div>
                </CardContent>
              </Card>

              {/* CA Encaissé */}
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">CA Encaissé</p>
                  </div>
                  <div className="text-2xl font-semibold text-foreground">
                    {(analytics.paidRevenue / 1000000).toFixed(2)}M
                  </div>
                </CardContent>
              </Card>

              {/* Progression Moyenne */}
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Progression</p>
                  </div>
                  <div className="text-2xl font-semibold text-foreground">
                    {analytics.avgProgress}%
                  </div>
                </CardContent>
              </Card>

              {/* Jalons en Retard */}
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Jalons en Retard</p>
                  </div>
                  <div className="text-2xl font-semibold text-foreground">
                    {analytics.delayedMilestones}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects Map */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Map Container */}
              <div className="flex-1">
                <div 
                  ref={mapContainer} 
                  className="w-full h-[400px] rounded-lg border border-border/50"
                />
              </div>

              {/* Project Cards Column */}
              <div className="lg:w-72 space-y-2 overflow-y-auto max-h-[400px]">
                {projects.map((project) => (
                  <Card 
                    key={project.id}
                    className={`border-border/50 cursor-pointer transition-colors ${selectedProject === project.id ? 'bg-accent' : ''}`}
                    onClick={() => setSelectedProject(project.id)}
                  >
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm mb-1">{project.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        <span>{project.location}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {(project.estimated_revenue / 1000000).toFixed(2)}M MAD
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-1.5">
                        <div
                          className={`h-full rounded-full ${
                            project.progress >= 90 ? 'bg-success' :
                            project.progress >= 50 ? 'bg-primary' :
                            project.progress >= 25 ? 'bg-muted-foreground' :
                            'bg-destructive'
                          }`}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}