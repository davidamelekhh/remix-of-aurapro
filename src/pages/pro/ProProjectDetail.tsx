import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Calendar, MapPin, Edit, Trash2, Plus, Home, UserPlus, FileText, MessageSquare, Upload, Download, Send, Clock, Check, X, UserCog, Building2, Phone, Mail, ChevronDown, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { PaymentDialog } from '@/components/project/PaymentDialog';
import { PaymentEditDialog } from '@/components/project/PaymentEditDialog';
import { StakeholderAssignDialog } from '@/components/project/StakeholderAssignDialog';
import { ProjectScheduleCalendar } from '@/components/project/ProjectScheduleCalendar';
import { MilestonesList } from '@/components/project/MilestonesList';
import { NEW_MILESTONES } from '@/lib/milestones-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProNavigation } from '@/components/layout/ProNavigation';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Project = {
  id: string;
  name: string;
  location: string;
  description: string | null;
  progress: number;
  status: string;
  phase: string;
  image_url: string | null;
  start_date: string;
  end_date: string;
  estimated_revenue: number | null;
};

type PropertyUnit = {
  id: string;
  unit_number: string;
  unit_type: string;
  surface_area: number | null;
  price: number | null;
  status: string;
  floor: string | null;
  description: string | null;
};

type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
};

type UnitAssignment = {
  client_id: string;
  unit_id: string;
  client?: Client;
};

type ProjectUpdate = {
  id: string;
  title: string;
  description: string | null;
  update_type: string;
  progress_percentage: number | null;
  created_at: string;
  media_urls: string[] | null;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
};

type ProjectDocument = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  file_type: string | null;
  description: string | null;
  created_at: string;
};

type Message = {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
};

export default function ProProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [project, setProject] = useState<Project | null>(null);
  const [units, setUnits] = useState<PropertyUnit[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [assignments, setAssignments] = useState<UnitAssignment[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [stakeholders, setStakeholders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUnitDialog, setShowUnitDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false);
  const [showEditProjectDialog, setShowEditProjectDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showPaymentEditDialog, setShowPaymentEditDialog] = useState(false);
  const [showStakeholderDialog, setShowStakeholderDialog] = useState(false);
  const [showStakeholderFormDialog, setShowStakeholderFormDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string>('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string>('');
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [projectConfig, setProjectConfig] = useState<any>(null);
  const [expandedMilestones, setExpandedMilestones] = useState<Set<string>>(new Set(['structural_work']));
  const [milestoneForm, setMilestoneForm] = useState({
    description: '',
    mediaFiles: [] as File[],
  });
  const [projectForm, setProjectForm] = useState({
    name: '',
    location: '',
    description: '',
    phase: '',
    status: '',
    start_date: '',
    end_date: '',
    progress: '',
    estimated_revenue: '',
  });
  const [unitForm, setUnitForm] = useState({
    unit_number: '',
    unit_type: '',
    surface_area: '',
    price: '',
    status: 'Disponible',
    floor: '',
    description: '',
  });
  const [stakeholderForm, setStakeholderForm] = useState({
    name: '',
    role: '',
    company: '',
    phone: '',
    email: '',
  });
  
  const [projectMilestones, setProjectMilestones] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchProjectData();

      // Subscribe to realtime messages
      const channel = supabase
        .channel(`project_${id}_messages`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'project_messages',
            filter: `project_id=eq.${id}`,
          },
          (payload) => {
            setMessages((current) => [...current, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single();

      if (projectError) throw projectError;
      setProject(projectData);

      // Fetch units
      const { data: unitsData, error: unitsError } = await supabase
        .from('property_units')
        .select('*')
        .eq('project_id', id)
        .order('unit_number');

      if (unitsError) throw unitsError;
      setUnits(unitsData || []);

      // Fetch all clients for assignment
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .eq('owner_id', user.id);

      if (clientsError) throw clientsError;
      setClients(clientsData || []);

      // Fetch unit assignments with client details
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('project_clients')
        .select(`
          client_id,
          unit_id,
          clients!inner (
            id,
            name,
            email,
            phone,
            status
          )
        `)
        .eq('project_id', id)
        .not('unit_id', 'is', null);

      if (assignmentsError) throw assignmentsError;
      
      // Transform the data to match our type
      const transformedAssignments = (assignmentsData || []).map((item: any) => ({
        client_id: item.client_id,
        unit_id: item.unit_id,
        client: item.clients
      }));
      
      setAssignments(transformedAssignments);

      // Fetch project updates
      const { data: updatesData, error: updatesError } = await supabase
        .from('project_updates')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (updatesError) throw updatesError;
      setUpdates(updatesData || []);

      // Fetch documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('project_documents')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: false });

      if (documentsError) throw documentsError;
      setDocuments(documentsData || []);

      // Fetch messages with profiles
      const { data: messagesData, error: messagesError } = await supabase
        .from('project_messages')
        .select('*')
        .eq('project_id', id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      // Fetch profiles for messages
      if (messagesData && messagesData.length > 0) {
        const senderIds = [...new Set(messagesData.map(m => m.sender_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', senderIds);

        const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
        const messagesWithProfiles = messagesData.map(msg => ({
          ...msg,
          profiles: profilesMap.get(msg.sender_id)
        }));
        setMessages(messagesWithProfiles as any);
      } else {
        setMessages([]);
      }

      // Fetch payment schedules
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payment_schedules')
        .select('*')
        .eq('project_id', id)
        .order('due_date', { ascending: true });

      if (paymentsError) throw paymentsError;
      setPayments(paymentsData || []);

      // Fetch stakeholders
      const { data: stakeholdersData, error: stakeholdersError } = await supabase
        .from('stakeholders')
        .select('*')
        .eq('owner_id', user.id)
        .order('name');

      if (stakeholdersError) throw stakeholdersError;
      setStakeholders(stakeholdersData || []);

      // Fetch or create project configuration
      let { data: configData, error: configError } = await supabase
        .from('project_configurations')
        .select('*')
        .eq('project_id', id)
        .maybeSingle();

      if (configError && configError.code !== 'PGRST116') throw configError;

      if (!configData) {
        const { data: newConfig, error: createConfigError } = await supabase
          .from('project_configurations')
          .insert({ project_id: id })
          .select()
          .single();

        if (createConfigError) throw createConfigError;
        setProjectConfig(newConfig);
      } else {
        setProjectConfig(configData);
      }

      // Fetch or create project milestones with new system
      const { data: existingMilestones, error: milestonesError } = await supabase
        .from('project_milestones')
        .select('*')
        .eq('project_id', id)
        .order('order_index');

      if (milestonesError) throw milestonesError;

      // If no milestones exist or if they're using old system, create new ones
      if (!existingMilestones || existingMilestones.length === 0 || (existingMilestones[0] && !existingMilestones[0].order_index)) {
        // Delete old milestones if any
        if (existingMilestones && existingMilestones.length > 0) {
          await supabase
            .from('project_milestones')
            .delete()
            .eq('project_id', id);
        }

        // Create new milestones
        const milestonesToCreate = NEW_MILESTONES.map((m: any) => ({
          project_id: id,
          milestone_key: m.milestone_key,
          label: m.label,
          progress_percentage: m.progress_percentage,
          order_index: m.order_index,
          is_conditional: m.is_conditional,
          is_enabled: m.is_enabled,
          condition_type: m.condition_type,
          status: 'pending'
        }));

        const { data: createdMilestones, error: createError } = await supabase
          .from('project_milestones')
          .insert(milestonesToCreate)
          .select();

        if (createError) throw createError;
        
        // Link sub-milestones to parent
        if (createdMilestones) {
          const parentMilestone = createdMilestones.find((m: any) => m.milestone_key === 'structural_work');
          const subMilestones = createdMilestones.filter((m: any) => 
            ['structural_work_foundation', 'structural_work_structure', 'structural_work_walls'].includes(m.milestone_key)
          );

          if (parentMilestone && subMilestones.length > 0) {
            const updates = subMilestones.map((sm: any) => ({
              id: sm.id,
              parent_milestone_id: parentMilestone.id
            }));

            for (const update of updates) {
              await supabase
                .from('project_milestones')
                .update({ parent_milestone_id: update.parent_milestone_id })
                .eq('id', update.id);
            }
          }

          // Re-fetch updated milestones
          const { data: updatedMilestones } = await supabase
            .from('project_milestones')
            .select('*')
            .eq('project_id', id)
            .order('order_index');

          setProjectMilestones(updatedMilestones || []);
        }
      } else {
        setProjectMilestones(existingMilestones);
      }

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

  const handleAddUnit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('property_units')
        .insert([
          {
            project_id: id,
            ...unitForm,
            surface_area: unitForm.surface_area ? Number(unitForm.surface_area) : null,
            price: unitForm.price ? Number(unitForm.price) : null,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Lot ajouté',
        description: 'Le lot a été ajouté avec succès',
      });

      setShowUnitDialog(false);
      setUnitForm({
        unit_number: '',
        unit_type: '',
        surface_area: '',
        price: '',
        status: 'Disponible',
        floor: '',
        description: '',
      });
      fetchProjectData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lot ?')) return;

    try {
      const { error } = await supabase
        .from('property_units')
        .delete()
        .eq('id', unitId);

      if (error) throw error;

      toast({
        title: 'Lot supprimé',
        description: 'Le lot a été supprimé avec succès',
      });

      fetchProjectData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleAssignClient = async () => {
    if (!selectedClientId || !selectedUnitId) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un client',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Check if assignment already exists
      const { data: existing } = await supabase
        .from('project_clients')
        .select('*')
        .eq('project_id', id)
        .eq('client_id', selectedClientId)
        .eq('unit_id', selectedUnitId)
        .single();

      if (existing) {
        toast({
          title: 'Erreur',
          description: 'Ce client est déjà assigné à ce lot',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('project_clients')
        .insert([
          {
            project_id: id,
            client_id: selectedClientId,
            unit_id: selectedUnitId,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Client assigné',
        description: 'Le client a été assigné au lot avec succès',
      });

      setShowAssignDialog(false);
      setSelectedClientId('');
      setSelectedUnitId('');
      fetchProjectData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUnassignClient = async (clientId: string, unitId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir désassigner ce client ?')) return;

    try {
      const { error } = await supabase
        .from('project_clients')
        .delete()
        .eq('project_id', id)
        .eq('client_id', clientId)
        .eq('unit_id', unitId);

      if (error) throw error;

      toast({
        title: 'Client désassigné',
        description: 'Le client a été désassigné du lot',
      });

      fetchProjectData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getUnitAssignments = (unitId: string) => {
    return assignments.filter(a => a.unit_id === unitId);
  };

  const handleCompleteMilestone = async () => {
    if (!selectedMilestoneId) return;

    setUploadingMedia(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const milestone = projectMilestones.find(m => m.id === selectedMilestoneId);
      if (!milestone) return;

      // Upload media files
      const mediaUrls: string[] = [];
      for (const file of milestoneForm.mediaFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${id}/milestones/${selectedMilestoneId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName);

        mediaUrls.push(publicUrl);
      }

      // Update milestone status
      const { error: milestoneError } = await supabase
        .from('project_milestones')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          description: milestoneForm.description || `Étape "${milestone.label}" complétée`
        })
        .eq('id', selectedMilestoneId);

      if (milestoneError) throw milestoneError;

      // Create milestone update for tracking
      const { error: updateError } = await supabase
        .from('project_updates')
        .insert([
          {
            project_id: id,
            title: milestone.label,
            description: milestoneForm.description || `Étape "${milestone.label}" complétée`,
            update_type: 'milestone',
            progress_percentage: milestone.progress_percentage,
            created_by: user.id,
            media_urls: mediaUrls.length > 0 ? mediaUrls : null,
          },
        ]);

      if (updateError) throw updateError;

      // Update project progress
      const { error: projectError } = await supabase
        .from('projects')
        .update({ progress: milestone.progress_percentage })
        .eq('id', id);

      if (projectError) throw projectError;

      toast({
        title: 'Étape complétée',
        description: `L'étape "${milestone.label}" a été marquée comme terminée`,
      });

      setShowMilestoneDialog(false);
      setSelectedMilestoneId('');
      setMilestoneForm({ description: '', mediaFiles: [] });
      fetchProjectData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: projectForm.name,
          location: projectForm.location,
          description: projectForm.description,
          phase: projectForm.phase,
          status: projectForm.status,
          start_date: projectForm.start_date,
          end_date: projectForm.end_date,
          progress: Number(projectForm.progress),
          estimated_revenue: Number(projectForm.estimated_revenue),
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Projet modifié',
        description: 'Les informations du projet ont été mises à jour',
      });

      setShowEditProjectDialog(false);
      fetchProjectData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleUploadProjectImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}/cover-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('projects')
        .update({ image_url: publicUrl })
        .eq('id', id);

      if (updateError) throw updateError;

      toast({
        title: 'Image ajoutée',
        description: 'L\'image du projet a été mise à jour',
      });

      fetchProjectData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('project-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('project_documents')
        .insert([
          {
            project_id: id,
            file_name: file.name,
            file_path: fileName,
            file_size: file.size,
            file_type: file.type,
            uploaded_by: user.id,
          },
        ]);

      if (dbError) throw dbError;

      toast({
        title: 'Document ajouté',
        description: 'Le document a été téléchargé avec succès',
      });

      fetchProjectData();
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDownloadDocument = async (doc: ProjectDocument) => {
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
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('project_messages')
        .insert([
          {
            project_id: id,
            sender_id: user.id,
            message: newMessage.trim(),
          },
        ]);

      if (error) throw error;

      setNewMessage('');
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <ProNavigation />
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
        <ProNavigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-muted-foreground">Projet non trouvé</p>
            <Link to="/pro/projects">
              <Button className="mt-4">Retour aux projets</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProNavigation />
      
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/pro/projects">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour aux projets
              </Button>
            </Link>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{project.name}</h1>
                <Badge>{project.status}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {project.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(project.start_date).toLocaleDateString('fr-FR')} - {new Date(project.end_date).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
            <Dialog open={showEditProjectDialog} onOpenChange={setShowEditProjectDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setProjectForm({
                      name: project.name,
                      location: project.location,
                      description: project.description || '',
                      phase: project.phase,
                      status: project.status,
                      start_date: project.start_date,
                      end_date: project.end_date,
                      progress: String(project.progress),
                      estimated_revenue: String(project.estimated_revenue || 0),
                    });
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Modifier le projet</DialogTitle>
                  <DialogDescription>
                    Modifiez les informations du projet
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditProject} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit_name">Nom du projet *</Label>
                      <Input
                        id="edit_name"
                        required
                        value={projectForm.name}
                        onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_location">Localisation *</Label>
                      <Input
                        id="edit_location"
                        required
                        value={projectForm.location}
                        onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit_description">Description</Label>
                    <Textarea
                      id="edit_description"
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit_phase">Phase *</Label>
                      <Select
                        value={projectForm.phase}
                        onValueChange={(value) => setProjectForm({ ...projectForm, phase: value })}
                      >
                        <SelectTrigger id="edit_phase">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Étude">Étude</SelectItem>
                          <SelectItem value="Construction">Construction</SelectItem>
                          <SelectItem value="Finitions">Finitions</SelectItem>
                          <SelectItem value="Livraison">Livraison</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_status">Statut *</Label>
                      <Select
                        value={projectForm.status}
                        onValueChange={(value) => setProjectForm({ ...projectForm, status: value })}
                      >
                        <SelectTrigger id="edit_status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="En cours">En cours</SelectItem>
                          <SelectItem value="Terminé">Terminé</SelectItem>
                          <SelectItem value="En pause">En pause</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit_start_date">Date de début *</Label>
                      <Input
                        id="edit_start_date"
                        type="date"
                        required
                        value={projectForm.start_date}
                        onChange={(e) => setProjectForm({ ...projectForm, start_date: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit_end_date">Date de fin *</Label>
                      <Input
                        id="edit_end_date"
                        type="date"
                        required
                        value={projectForm.end_date}
                        onChange={(e) => setProjectForm({ ...projectForm, end_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit_progress">Progression (%)</Label>
                    <Input
                      id="edit_progress"
                      type="number"
                      min="0"
                      max="100"
                      value={projectForm.progress}
                      onChange={(e) => setProjectForm({ ...projectForm, progress: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit_estimated_revenue">Revenu estimé (MAD)</Label>
                    <Input
                      id="edit_estimated_revenue"
                      type="number"
                      min="0"
                      step="1000"
                      value={projectForm.estimated_revenue}
                      onChange={(e) => setProjectForm({ ...projectForm, estimated_revenue: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="project_image">Image du projet</Label>
                    <Input
                      id="project_image"
                      type="file"
                      accept="image/*"
                      onChange={handleUploadProjectImage}
                      disabled={uploadingImage}
                    />
                    {uploadingImage && <p className="text-sm text-muted-foreground">Téléchargement...</p>}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" className="flex-1">Enregistrer</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEditProjectDialog(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Progress */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progression globale</span>
              <span className="text-sm font-bold">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="units">Lots ({units.length})</TabsTrigger>
            <TabsTrigger value="milestones">Étapes</TabsTrigger>
            <TabsTrigger value="payments">Paiements</TabsTrigger>
            <TabsTrigger value="stakeholders">Intervenants</TabsTrigger>
            <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Vue d'ensemble avec design professionnel */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Colonne gauche - Informations */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{project.name}</h2>
                      <div className="flex items-center text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{project.location}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <Label className="text-sm text-muted-foreground mb-1 block">Phase actuelle</Label>
                        <p className="text-lg font-semibold text-primary">{project.phase}</p>
                      </div>

                      <div className="p-4 rounded-lg bg-secondary/20 border">
                        <Label className="text-sm text-muted-foreground mb-1 block">Statut</Label>
                        <Badge className="text-base px-3 py-1">
                          {project.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg border bg-card">
                          <Label className="text-sm text-muted-foreground mb-1 block">Date de début</Label>
                          <p className="font-medium">
                            {new Date(project.start_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg border bg-card">
                          <Label className="text-sm text-muted-foreground mb-1 block">Date de fin</Label>
                          <p className="font-medium">
                            {new Date(project.end_date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>

                      {project.estimated_revenue && (
                        <div className="p-4 rounded-lg border bg-accent/10">
                          <Label className="text-sm text-muted-foreground mb-1 block">Revenu estimé</Label>
                          <p className="text-2xl font-bold">
                            {project.estimated_revenue.toLocaleString()} MAD
                          </p>
                        </div>
                      )}

                      {project.description && (
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold">Description</Label>
                          <p className="text-muted-foreground leading-relaxed">
                            {project.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Colonne droite - Images */}
                  <div className="space-y-4">
                    {project.image_url ? (
                      <div className="relative group rounded-lg overflow-hidden border shadow-lg">
                        <img
                          src={project.image_url}
                          alt={project.name}
                          className="w-full h-[500px] object-cover transition-transform group-hover:scale-105 duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-4 left-4 text-white">
                            <p className="text-sm font-medium">Image principale du projet</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[500px] rounded-lg border-2 border-dashed bg-muted/20">
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Aucune image</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                      {/* Placeholder pour images supplémentaires */}
                      <div className="aspect-video rounded-lg border bg-muted/20 flex items-center justify-center">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="aspect-video rounded-lg border bg-muted/20 flex items-center justify-center">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="units" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Lots du projet</CardTitle>
                    <CardDescription>Gérez les lots à vendre de ce projet</CardDescription>
                  </div>
                  <Dialog open={showUnitDialog} onOpenChange={setShowUnitDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter un lot
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Ajouter un lot</DialogTitle>
                        <DialogDescription>
                          Créez un nouveau lot pour ce projet
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddUnit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="unit_number">Numéro du lot *</Label>
                            <Input
                              id="unit_number"
                              required
                              value={unitForm.unit_number}
                              onChange={(e) => setUnitForm({ ...unitForm, unit_number: e.target.value })}
                              placeholder="Ex: A-101"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="unit_type">Type *</Label>
                            <Select
                              value={unitForm.unit_type}
                              onValueChange={(value) => setUnitForm({ ...unitForm, unit_type: value })}
                            >
                              <SelectTrigger id="unit_type">
                                <SelectValue placeholder="Sélectionnez" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Appartement">Appartement</SelectItem>
                                <SelectItem value="Villa">Villa</SelectItem>
                                <SelectItem value="Studio">Studio</SelectItem>
                                <SelectItem value="Duplex">Duplex</SelectItem>
                                <SelectItem value="Commerce">Commerce</SelectItem>
                                <SelectItem value="Bureau">Bureau</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="surface_area">Surface (m²)</Label>
                            <Input
                              id="surface_area"
                              type="number"
                              value={unitForm.surface_area}
                              onChange={(e) => setUnitForm({ ...unitForm, surface_area: e.target.value })}
                              placeholder="120"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="price">Prix (MAD)</Label>
                            <Input
                              id="price"
                              type="number"
                              value={unitForm.price}
                              onChange={(e) => setUnitForm({ ...unitForm, price: e.target.value })}
                              placeholder="1500000"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="floor">Étage</Label>
                            <Input
                              id="floor"
                              value={unitForm.floor}
                              onChange={(e) => setUnitForm({ ...unitForm, floor: e.target.value })}
                              placeholder="RDC, 1er, 2ème..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="status">Statut *</Label>
                            <Select
                              value={unitForm.status}
                              onValueChange={(value) => setUnitForm({ ...unitForm, status: value })}
                            >
                              <SelectTrigger id="status">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Disponible">Disponible</SelectItem>
                                <SelectItem value="Réservé">Réservé</SelectItem>
                                <SelectItem value="Vendu">Vendu</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={unitForm.description}
                            onChange={(e) => setUnitForm({ ...unitForm, description: e.target.value })}
                            placeholder="Détails du lot..."
                            rows={3}
                          />
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button type="submit" className="flex-1">Ajouter</Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowUnitDialog(false)}
                          >
                            Annuler
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {units.length === 0 ? (
                  <div className="text-center py-12">
                    <Home className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun lot pour ce projet</p>
                    <Button className="mt-4" onClick={() => setShowUnitDialog(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter le premier lot
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Numéro</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Surface</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Étage</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Client assigné</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {units.map((unit) => {
                        const unitAssignments = getUnitAssignments(unit.id);
                        return (
                          <TableRow key={unit.id}>
                            <TableCell className="font-medium">{unit.unit_number}</TableCell>
                            <TableCell>{unit.unit_type}</TableCell>
                            <TableCell>{unit.surface_area ? `${unit.surface_area} m²` : '-'}</TableCell>
                            <TableCell>{unit.price ? `${unit.price.toLocaleString()} MAD` : '-'}</TableCell>
                            <TableCell>{unit.floor || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={unit.status === 'Vendu' ? 'default' : unit.status === 'Réservé' ? 'secondary' : 'outline'}>
                                {unit.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {unitAssignments.length > 0 ? (
                                <div className="space-y-1">
                                  {unitAssignments.map((assignment) => (
                                    <div key={assignment.client_id} className="flex items-center justify-between gap-2">
                                      <span className="text-sm">{assignment.client?.name || 'Client inconnu'}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleUnassignClient(assignment.client_id, assignment.unit_id)}
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUnitId(unit.id);
                                    setShowAssignDialog(true);
                                  }}
                                >
                                  <UserPlus className="h-4 w-4 mr-2" />
                                  Assigner
                                </Button>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUnit(unit.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Étapes d'élaboration du projet de la conception à la livraison</CardTitle>
                <CardDescription>Suivez les différentes étapes du projet</CardDescription>
              </CardHeader>
              <CardContent>
                <MilestonesList
                  projectMilestones={projectMilestones}
                  projectConfig={projectConfig}
                  projectId={id!}
                  onMilestoneClick={(milestoneId) => {
                    setSelectedMilestoneId(milestoneId);
                    setShowMilestoneDialog(true);
                  }}
                  onStakeholderClick={(milestoneId) => {
                    setSelectedMilestoneId(milestoneId);
                    setShowStakeholderDialog(true);
                  }}
                  onRefresh={fetchProjectData}
                />
              </CardContent>
            </Card>

            {/* Dialog pour compléter une étape */}
            <Dialog open={showMilestoneDialog} onOpenChange={setShowMilestoneDialog}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    Compléter l'étape : {projectMilestones.find(m => m.id === selectedMilestoneId)?.label}
                  </DialogTitle>
                  <DialogDescription>
                    Ajoutez des photos, vidéos et un commentaire pour documenter cette étape
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="milestone_description">Commentaire</Label>
                    <Textarea
                      id="milestone_description"
                      value={milestoneForm.description}
                      onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                      placeholder="Décrivez l'avancement de cette étape..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="milestone_media">Photos et vidéos</Label>
                    <Input
                      id="milestone_media"
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setMilestoneForm({ ...milestoneForm, mediaFiles: files });
                      }}
                    />
                    {milestoneForm.mediaFiles.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {milestoneForm.mediaFiles.length} fichier(s) sélectionné(s)
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button 
                      onClick={handleCompleteMilestone} 
                      className="flex-1"
                      disabled={uploadingMedia}
                    >
                      {uploadingMedia ? 'Enregistrement...' : 'Valider l\'étape'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowMilestoneDialog(false);
                        setSelectedMilestoneId('');
                        setMilestoneForm({ description: '', mediaFiles: [] });
                      }}
                      disabled={uploadingMedia}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowPaymentDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un paiement
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Échéancier des paiements</CardTitle>
                <CardDescription>Gérez les paiements du projet</CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Aucun paiement programmé
                  </p>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div key={payment.id} className="p-4 rounded-md border">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{payment.title}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedPayment(payment);
                                  setShowPaymentEditDialog(true);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                            {payment.description && (
                              <p className="text-sm text-muted-foreground mt-1">{payment.description}</p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="font-semibold text-foreground">{payment.amount.toLocaleString()} MAD</span>
                              {payment.payment_percentage && (
                                <span>({payment.payment_percentage}%)</span>
                              )}
                              <span>Échéance: {new Date(payment.due_date).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                          <Badge variant={
                            payment.status === 'paid' ? 'default' : 
                            payment.status === 'overdue' ? 'destructive' : 
                            'secondary'
                          }>
                            {payment.status === 'paid' ? 'Payé' : 
                             payment.status === 'overdue' ? 'En retard' : 
                             'En attente'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="stakeholders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Intervenants du projet</CardTitle>
                    <CardDescription>Gérez les intervenants et leurs assignations aux étapes</CardDescription>
                  </div>
                  <Button onClick={() => setShowStakeholderFormDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un intervenant
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {stakeholders.length === 0 ? (
                  <div className="text-center py-12">
                    <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun intervenant pour le moment</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stakeholders.map((stakeholder) => (
                      <Card key={stakeholder.id}>
                        <CardHeader className="flex flex-row items-start justify-between space-y-0">
                          <div>
                            <CardTitle className="text-lg">{stakeholder.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              if (!confirm('Êtes-vous sûr de vouloir supprimer cet intervenant ?')) return;
                              try {
                                const { error } = await supabase
                                  .from('stakeholders')
                                  .delete()
                                  .eq('id', stakeholder.id);

                                if (error) throw error;

                                toast({
                                  title: 'Succès',
                                  description: 'Intervenant supprimé'
                                });

                                fetchProjectData();
                              } catch (error) {
                                console.error('Error deleting stakeholder:', error);
                                toast({
                                  title: 'Erreur',
                                  description: 'Impossible de supprimer l\'intervenant',
                                  variant: 'destructive'
                                });
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {stakeholder.company && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Building2 className="h-4 w-4 mr-2" />
                              {stakeholder.company}
                            </div>
                          )}
                          {stakeholder.phone && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="h-4 w-4 mr-2" />
                              {stakeholder.phone}
                            </div>
                          )}
                          {stakeholder.email && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="h-4 w-4 mr-2" />
                              {stakeholder.email}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Documents du projet</CardTitle>
                    <CardDescription>Plans, devis, photos, etc.</CardDescription>
                  </div>
                  <div>
                    <Input
                      type="file"
                      id="doc-upload"
                      className="hidden"
                      onChange={handleUploadDocument}
                      disabled={uploadingDoc}
                    />
                    <Label htmlFor="doc-upload">
                      <Button asChild disabled={uploadingDoc}>
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          {uploadingDoc ? 'Upload...' : 'Télécharger'}
                        </span>
                      </Button>
                    </Label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun document</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary/50"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium">{doc.file_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(2)} MB` : ''} •{' '}
                              {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadDocument(doc)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle>Discussion</CardTitle>
                <CardDescription>Communiquez avec l'équipe du projet</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {(msg.profiles as any)?.full_name || 'Utilisateur'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.created_at).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-sm bg-secondary rounded-lg p-3">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrivez un message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Assign Client Dialog */}
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assigner un client</DialogTitle>
              <DialogDescription>
                Sélectionnez un client à assigner à ce lot
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client *</Label>
                {clients.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Vous n'avez pas encore de clients
                    </p>
                    <Link to="/pro/clients/new">
                      <Button variant="outline" size="sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Créer un client
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <Select
                    value={selectedClientId}
                    onValueChange={setSelectedClientId}
                  >
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Sélectionnez un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name} - {client.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={handleAssignClient} 
                className="flex-1"
                disabled={!selectedClientId || clients.length === 0}
              >
                Assigner
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAssignDialog(false);
                  setSelectedClientId('');
                }}
              >
                Annuler
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        projectId={id!}
        units={units}
        clients={clients}
        onPaymentAdded={fetchProjectData}
      />

      <PaymentEditDialog
        open={showPaymentEditDialog}
        onOpenChange={setShowPaymentEditDialog}
        payment={selectedPayment}
        units={units}
        clients={clients}
        onPaymentUpdated={fetchProjectData}
      />

      <StakeholderAssignDialog
        milestoneId={selectedMilestoneId}
        open={showStakeholderDialog}
        onOpenChange={setShowStakeholderDialog}
        onAssigned={fetchProjectData}
      />

      {/* Add Stakeholder Dialog */}
      <Dialog open={showStakeholderFormDialog} onOpenChange={setShowStakeholderFormDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un intervenant</DialogTitle>
            <DialogDescription>
              Créez un nouveau contact intervenant pour ce projet
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) return;

              const { error } = await supabase
                .from('stakeholders')
                .insert([{
                  owner_id: user.id,
                  name: formData.get('name') as string,
                  role: formData.get('role') as string,
                  company: formData.get('company') as string || null,
                  phone: formData.get('phone') as string || null,
                  email: formData.get('email') as string || null
                }]);

              if (error) throw error;

              toast({
                title: 'Succès',
                description: 'Intervenant ajouté avec succès'
              });

              setShowStakeholderFormDialog(false);
              fetchProjectData();
            } catch (error) {
              console.error('Error creating stakeholder:', error);
              toast({
                title: 'Erreur',
                description: 'Impossible d\'ajouter l\'intervenant',
                variant: 'destructive'
              });
            }
          }}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Rôle *</Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="ex: Architecte, Électricien, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="company">Entreprise</Label>
                <Input
                  id="company"
                  name="company"
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button type="submit" className="flex-1">Ajouter</Button>
              <Button type="button" variant="outline" onClick={() => setShowStakeholderFormDialog(false)}>
                Annuler
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
