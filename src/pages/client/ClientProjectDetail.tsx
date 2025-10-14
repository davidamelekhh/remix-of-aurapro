import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Navigation } from '@/components/layout/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, CheckCircle, Circle, Download, Calendar, MessageCircle, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

type Milestone = {
  id: string;
  milestone_key: string;
  label: string;
  description: string | null;
  status: string;
  progress_percentage: number;
  start_date: string | null;
  end_date: string | null;
  completed_at: string | null;
};

type Message = {
  id: string;
  message: string;
  created_at: string;
  sender_id: string;
  sender_name?: string;
};

type Document = {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  description: string | null;
  created_at: string;
};

type ProjectUpdate = {
  id: string;
  title: string;
  description: string | null;
  update_type: string;
  status: string | null;
  progress_percentage: number | null;
  media_urls: string[] | null;
  created_at: string;
};

type Project = {
  id: string;
  name: string;
  location: string;
  description: string;
  phase: string;
  status: string;
  progress: number;
  start_date: string;
  end_date: string;
  image_url: string | null;
};

export default function ClientProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Get milestones
      const { data: milestonesData, error: milestonesError } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', id)
        .order('start_date', { ascending: true });

      if (milestonesError) throw milestonesError;
      setMilestones(milestonesData || []);

      // Get messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('project_messages')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Get sender profiles
      const senderIds = [...new Set(messagesData?.map(m => m.sender_id) || [])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', senderIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);
      const messagesWithNames = messagesData?.map(msg => ({
        ...msg,
        sender_name: profileMap.get(msg.sender_id) || 'Utilisateur'
      })) || [];

      setMessages(messagesWithNames);

      // Get documents
      const { data: docsData, error: docsError } = await supabase
        .from('project_documents')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;
      setDocuments(docsData || []);

      // Get project updates
      const { data: updatesData, error: updatesError } = await supabase
        .from('project_updates')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (updatesError) throw updatesError;
      setUpdates(updatesData || []);

    } catch (error: any) {
      console.error('Error fetching project details:', error);
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (doc: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('project-documents')
        .download(doc.file_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger le document',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-muted-foreground">Projet non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/client/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux projets
        </Button>

        {/* Project Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{project.name}</h1>
              <p className="text-muted-foreground">{project.location}</p>
            </div>
            <Badge variant={project.status === 'En cours' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Avancement global</span>
              <span className="font-semibold">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-3" />
          </div>

          {project.image_url && (
            <div className="rounded-lg overflow-hidden mb-6">
              <img
                src={project.image_url}
                alt={project.name}
                className="w-full h-64 object-cover"
              />
            </div>
          )}

          <p className="text-foreground">{project.description}</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="progress" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="progress">Avancement</TabsTrigger>
            <TabsTrigger value="updates">Actualités</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Étapes du projet</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="flex gap-4 pb-4 border-b last:border-0">
                      <div className="flex-shrink-0 mt-1">
                        {milestone.status === 'completed' ? (
                          <CheckCircle className="h-6 w-6 text-success" />
                        ) : (
                          <Circle className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{milestone.label}</h4>
                            {milestone.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {milestone.description}
                              </p>
                            )}
                          </div>
                          <Badge variant={
                            milestone.status === 'completed' ? 'default' :
                            milestone.status === 'in_progress' ? 'secondary' :
                            'outline'
                          }>
                            {milestone.status === 'completed' ? 'Terminé' :
                             milestone.status === 'in_progress' ? 'En cours' :
                             'À venir'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progression</span>
                            <span className="font-medium">{milestone.progress_percentage}%</span>
                          </div>
                          <Progress value={milestone.progress_percentage} className="h-2" />
                          
                          {(milestone.start_date || milestone.end_date) && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {milestone.start_date && format(new Date(milestone.start_date), 'dd MMM yyyy', { locale: fr })}
                                {milestone.start_date && milestone.end_date && ' - '}
                                {milestone.end_date && format(new Date(milestone.end_date), 'dd MMM yyyy', { locale: fr })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {milestones.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Aucune étape définie pour le moment
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates" className="space-y-6">
            {updates.length === 0 ? (
              <Card>
                <CardContent className="py-8">
                  <p className="text-center text-muted-foreground">
                    Aucune actualité pour le moment
                  </p>
                </CardContent>
              </Card>
            ) : (
              updates.map((update) => (
                <Card key={update.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{update.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(update.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                        </p>
                      </div>
                      <Badge variant={update.update_type === 'milestone' ? 'default' : 'secondary'}>
                        {update.update_type === 'milestone' ? 'Étape' : 'Général'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {update.description && (
                      <p className="text-foreground mb-4">{update.description}</p>
                    )}
                    
                    {update.progress_percentage !== null && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Progression</span>
                          <span className="font-medium">{update.progress_percentage}%</span>
                        </div>
                        <Progress value={update.progress_percentage} className="h-2" />
                      </div>
                    )}

                    {update.media_urls && update.media_urls.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {update.media_urls.map((url, idx) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`Photo ${idx + 1}`}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Discussion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {messages.map((message) => (
                    <div key={message.id} className="p-4 bg-secondary/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm">{message.sender_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                        </span>
                      </div>
                      <p className="text-foreground">{message.message}</p>
                    </div>
                  ))}
                  
                  {messages.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun message pour le moment
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents du projet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.file_name}</p>
                          {doc.description && (
                            <p className="text-sm text-muted-foreground">{doc.description}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(doc.created_at), 'dd MMM yyyy', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadDocument(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  {documents.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Aucun document disponible
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
