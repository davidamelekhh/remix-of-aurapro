import { useEffect, useState, useRef } from 'react';
import { ProNavigation } from '@/components/layout/ProNavigation';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign, CheckCircle2, AlertCircle, MapPin, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getProjects } from '@/lib/api';

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
      // TODO: Get actual user ID from your auth system
      const userId = 'mock-user-id';

      // Fetch projects using API
      const projectsData = await getProjects(userId);
      
      setProjects(projectsData.map(p => ({
        id: p.id,
        name: p.name,
        progress: p.progress,
        status: p.status,
        location: p.location,
        estimated_revenue: p.estimated_revenue || 0
      })));

      // Calculate analytics from mock data
      const totalProjects = projectsData.length;
      const avgProgress = totalProjects > 0 
        ? Math.round(projectsData.reduce((sum, p) => sum + p.progress, 0) / totalProjects)
        : 0;

      // Mock analytics values - TODO: Calculate from real data
      const totalRevenue = projectsData.reduce((sum, p) => sum + (p.estimated_revenue || 0), 0);

      setAnalytics({
        totalProjects,
        avgProgress,
        delayedMilestones: 2, // Mock value
        avgDelayPerStage: 5, // Mock value
        unitsSold: 15, // Mock value
        unitsDelivered: 8, // Mock value
        totalRevenue,
        paidRevenue: totalRevenue * 0.4, // Mock 40% paid
        weeklyActivity: {
          messages: 12, // Mock value
          documents: 5 // Mock value
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
