import { ArrowLeft, Calendar, CheckCircle, Circle, MessageCircle, FileText, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import projectVilla from '@/assets/project-villa.jpg';

const milestones = [
  { id: 1, name: 'Fondations', nameAr: 'الأساسات', completed: true, date: '15 Jan 2024' },
  { id: 2, name: 'Structure', nameAr: 'الهيكل', completed: true, date: '28 Feb 2024' },
  { id: 3, name: 'Finitions', nameAr: 'التشطيبات', completed: false, date: '15 Mar 2024' },
  { id: 4, name: 'Livraison', nameAr: 'التسليم', completed: false, date: '30 Mar 2024' },
];

const timelineEvents = [
  {
    id: 1,
    title: 'Début des travaux de fondation',
    date: '15 Jan 2024',
    type: 'milestone',
    completed: true,
  },
  {
    id: 2,
    title: 'Inspection qualité structure',
    date: '25 Feb 2024',
    type: 'inspection',
    completed: true,
  },
  {
    id: 3,
    title: 'Début des finitions',
    date: '1 Mar 2024',
    type: 'milestone',
    completed: false,
  },
];

const messages = [
  {
    id: 1,
    sender: 'Architecte',
    message: 'Les travaux de structure sont terminés selon le planning.',
    time: '14:30',
    date: '28 Feb 2024',
    type: 'update',
  },
  {
    id: 2,
    sender: 'Client',
    message: 'Parfait ! Pouvez-vous m\'envoyer les photos ?',
    time: '15:45',
    date: '28 Feb 2024',
    type: 'question',
  },
];

const documents = [
  { id: 1, name: 'Contrat de construction.pdf', type: 'contract', date: '10 Jan 2024' },
  { id: 2, name: 'Permis de construire.pdf', type: 'permit', date: '5 Jan 2024' },
  { id: 3, name: 'Facture matériaux.pdf', type: 'invoice', date: '20 Feb 2024' },
];

export default function ProjectDetail() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-primary mb-2">Résidence Al Andalus</h1>
            <p className="text-muted-foreground">Casablanca, Ain Diab • Client: Mohammed Ben Ahmed</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200">En cours</Badge>
            <div className="text-right">
              <p className="text-2xl font-bold text-accent">75%</p>
              <p className="text-sm text-muted-foreground">Avancement</p>
            </div>
          </div>
        </div>
        
        <Progress value={75} className="mt-4 h-3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Image */}
          <Card className="overflow-hidden">
            <img
              src={projectVilla}
              alt="Résidence Al Andalus"
              className="w-full h-64 object-cover"
            />
          </Card>

          {/* Milestones */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-accent" />
              Étapes du projet
            </h2>
            
            <div className="space-y-4">
              {milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center space-x-4 p-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                  <div className="flex-shrink-0">
                    {milestone.completed ? (
                      <CheckCircle className="h-6 w-6 text-success" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${milestone.completed ? 'text-primary' : 'text-muted-foreground'}`}>
                      {milestone.name}
                    </h3>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {milestone.date}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-primary mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-accent" />
              Chronologie
            </h2>
            
            <div className="space-y-6">
              {timelineEvents.map((event, index) => (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${event.completed ? 'bg-success' : 'bg-muted-foreground'}`} />
                    {index < timelineEvents.length - 1 && (
                      <div className="w-0.5 h-12 bg-border mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className={`font-medium ${event.completed ? 'text-primary' : 'text-muted-foreground'}`}>
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Messages */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-accent" />
              Messages
            </h2>
            
            <div className="space-y-4 mb-4">
              {messages.map((message) => (
                <div key={message.id} className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">{message.sender}</span>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                  <p className="text-sm text-foreground">{message.message}</p>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3">
              <Textarea
                placeholder="Écrire un message..."
                className="resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Fichier
                </Button>
                <Button size="sm" className="bg-accent hover:bg-accent/90">
                  Envoyer
                </Button>
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-accent" />
              Documents
            </h2>
            
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-primary">{doc.name}</h3>
                    <p className="text-xs text-muted-foreground">{doc.date}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}