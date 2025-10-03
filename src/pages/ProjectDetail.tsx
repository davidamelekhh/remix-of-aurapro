import { ArrowLeft, Calendar, CheckCircle, Circle, MessageCircle, FileText, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import projectVilla from '@/assets/project-villa.jpg';

// Fusionner étapes et chronologie
const projectTimeline = [
  { 
    id: 1, 
    name: 'Fondations', 
    completed: true, 
    date: '15 Jan 2024',
    type: 'milestone',
    description: 'Début des travaux de fondation'
  },
  { 
    id: 2, 
    name: 'Structure', 
    completed: true, 
    date: '28 Feb 2024',
    type: 'milestone',
    description: 'Inspection qualité structure réalisée avec succès'
  },
  { 
    id: 3, 
    name: 'Finitions', 
    completed: false, 
    date: '15 Mar 2024',
    type: 'milestone',
    description: 'Début des travaux de finitions prévus'
  },
  { 
    id: 4, 
    name: 'Livraison', 
    completed: false, 
    date: '30 Mar 2024',
    type: 'milestone',
    description: 'Livraison finale du projet'
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
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Résidence Al Andalus</h1>
            <p className="text-muted-foreground">Casablanca, Ain Diab • Client: Mohammed Ben Ahmed</p>
          </div>
          
          <Badge className="bg-background text-foreground border-border self-start lg:self-center">
            En cours
          </Badge>
        </div>
        
        {/* Progress Bar avec % à droite */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground font-light">Avancement du projet</span>
          </div>
          <div className="relative">
            <Progress value={75} className="h-2" />
            <div className="absolute -top-1 right-0 transform translate-x-full ml-3">
              <span className="text-2xl font-bold text-foreground">75%</span>
            </div>
          </div>
        </div>
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

          {/* Timeline fusionnée avec étapes */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-foreground" strokeWidth={1.5} />
              Progression du projet
            </h2>
            
            <div className="space-y-1">
              {projectTimeline.map((event, index) => (
                <div key={event.id} className="flex items-start gap-4">
                  {/* Timeline visual */}
                  <div className="flex flex-col items-center pt-1">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 transition-colors",
                      event.completed 
                        ? "bg-foreground border-foreground" 
                        : "bg-background border-muted"
                    )}>
                      {event.completed && (
                        <CheckCircle className="w-3 h-3 text-background absolute" strokeWidth={3} />
                      )}
                    </div>
                    {index < projectTimeline.length - 1 && (
                      <div className={cn(
                        "w-0.5 h-20 mt-1 transition-colors",
                        event.completed ? "bg-foreground/20" : "bg-muted"
                      )} />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-6 pt-0.5">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className={cn(
                        "font-semibold text-base",
                        event.completed ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {event.name}
                      </h3>
                      <span className="text-xs text-muted-foreground font-light ml-4 flex-shrink-0">
                        {event.date}
                      </span>
                    </div>
                    <p className={cn(
                      "text-sm font-light",
                      event.completed ? "text-muted-foreground" : "text-muted-foreground/60"
                    )}>
                      {event.description}
                    </p>
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
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-foreground" strokeWidth={1.5} />
              Messages
            </h2>
            
            <div className="space-y-4 mb-4">
              {messages.map((message) => (
                <div key={message.id} className="p-3 rounded-lg bg-secondary border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{message.sender}</span>
                    <span className="text-xs text-muted-foreground">{message.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-light">{message.message}</p>
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
                <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                  Envoyer
                </Button>
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-foreground" strokeWidth={1.5} />
              Documents
            </h2>
            
            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-secondary transition-colors">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-foreground">{doc.name}</h3>
                    <p className="text-xs text-muted-foreground font-light">{doc.date}</p>
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