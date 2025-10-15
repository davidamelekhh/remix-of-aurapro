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
    <div className="min-h-screen bg-white">
      <ProNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl font-bold text-foreground mb-4">Analytics</h1>
          <p className="text-lg text-muted-foreground">La tour de contrôle de votre empire immobilier</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="text-muted-foreground mt-4">Chargement des analytics...</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Key Metrics Grid */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h2 className="text-2xl font-semibold mb-8 text-foreground">Vue d'ensemble</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* CA Estimé */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border-border/30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <DollarSign className="h-6 w-6 text-primary" />
                        </div>
                        <TrendingUp className="h-5 w-5 text-success" />
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-3xl font-bold text-foreground mb-1"
                      >
                        {(analytics.totalRevenue / 1000000).toFixed(2)}M MAD
                      </motion.div>
                      <p className="text-sm text-muted-foreground">CA Total Estimé</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* CA Encaissé */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border-border/30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-success/10">
                          <CheckCircle2 className="h-6 w-6 text-success" />
                        </div>
                        <span className="text-xs font-medium text-success">
                          {analytics.totalRevenue > 0 ? Math.round((analytics.paidRevenue / analytics.totalRevenue) * 100) : 0}%
                        </span>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="text-3xl font-bold text-foreground mb-1"
                      >
                        {(analytics.paidRevenue / 1000000).toFixed(2)}M MAD
                      </motion.div>
                      <p className="text-sm text-muted-foreground">CA Encaissé</p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Progression Moyenne */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border-border/30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <BarChart3 className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="text-3xl font-bold text-foreground mb-1"
                      >
                        {analytics.avgProgress}%
                      </motion.div>
                      <p className="text-sm text-muted-foreground">
                        Progression Moyenne · {analytics.totalProjects} projet{analytics.totalProjects > 1 ? 's' : ''}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Jalons en Retard */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  <Card className="backdrop-blur-xl bg-gradient-to-br from-card/80 to-card/60 border-border/30 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-destructive/10">
                          <AlertCircle className="h-6 w-6 text-destructive" />
                        </div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.7 }}
                        className="text-3xl font-bold text-foreground mb-1"
                      >
                        {analytics.delayedMilestones}
                      </motion.div>
                      <p className="text-sm text-muted-foreground">
                        Jalons en Retard · {analytics.avgDelayPerStage}j moy.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.section>

            {/* Projects Map */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold mb-8 text-foreground">Carte des Projets</h2>
              <div className="flex gap-6">
                {/* Map Container */}
                <div className="flex-1">
                  <div 
                    ref={mapContainer} 
                    className="w-full h-[600px] rounded-2xl shadow-xl border border-border/20 overflow-hidden"
                  />
                </div>

                {/* Project Cards Column */}
                <div className="w-80 space-y-3 overflow-y-auto max-h-[600px] pr-2">
                  {projects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                      whileHover={{ x: -4, transition: { duration: 0.2 } }}
                      onClick={() => setSelectedProject(project.id)}
                    >
                      <Card className={`backdrop-blur-xl ${getStatusColor(project.progress)} ${selectedProject === project.id ? 'ring-2 ring-primary' : ''} border transition-all duration-300 hover:shadow-lg cursor-pointer`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground mb-1 truncate">{project.name}</h3>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{project.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Revenue */}
                          <div className="mb-3 p-2 bg-background/30 rounded-lg">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <DollarSign className="h-3 w-3" />
                              <span>Revenue Estimé</span>
                            </div>
                            <div className="text-lg font-bold text-foreground">
                              {(project.estimated_revenue / 1000000).toFixed(2)}M MAD
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Progression</span>
                              <span className="font-semibold text-foreground">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${project.progress}%` }}
                                transition={{ duration: 1, delay: 0.6 + index * 0.1, ease: "easeOut" }}
                                className={`h-full ${
                                  project.progress >= 90 ? 'bg-success' :
                                  project.progress >= 50 ? 'bg-primary' :
                                  project.progress >= 25 ? 'bg-muted-foreground' :
                                  'bg-destructive'
                                }`}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* AI Insights */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="relative"
            >
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">L'intelligence qui anticipe</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiInsights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.15 }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  >
                    <Card className="h-full backdrop-blur-xl bg-gradient-to-br from-card/90 to-card/70 border-border/40 shadow-lg hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-xl bg-background/50 ${insight.color}`}>
                            <insight.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-2">{insight.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="relative mt-20 mb-12"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-foreground to-foreground/90 p-12 text-center shadow-2xl">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="relative z-10"
                >
                  <h2 className="text-4xl font-bold text-background mb-4">
                    Aura Pro, la tour de contrôle de votre empire immobilier
                  </h2>
                  <p className="text-lg text-background/80 mb-8 max-w-2xl mx-auto">
                    Prenez des décisions éclairées avec une vision complète et en temps réel de tous vos projets
                  </p>
                  <Button 
                    size="lg"
                    className="bg-background text-foreground hover:bg-background/90 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    Explorer mes projets
                  </Button>
                </motion.div>
              </div>
            </motion.section>
          </div>
        )}
      </main>
    </div>
  );
}