import { Navigation } from '@/components/layout/Navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Download, Upload, Search, File, FileCheck, FileWarning } from 'lucide-react';
import { useState } from 'react';

type DocumentType = 'contract' | 'permit' | 'invoice' | 'plan' | 'report';

interface Document {
  id: number;
  name: string;
  type: DocumentType;
  project: string;
  date: string;
  size: string;
}

const documents: Document[] = [
  { id: 1, name: 'Contrat de construction.pdf', type: 'contract', project: 'Résidence Al Andalus', date: '10 Jan 2024', size: '2.4 MB' },
  { id: 2, name: 'Permis de construire.pdf', type: 'permit', project: 'Résidence Al Andalus', date: '5 Jan 2024', size: '1.2 MB' },
  { id: 3, name: 'Facture matériaux.pdf', type: 'invoice', project: 'Résidence Al Andalus', date: '20 Feb 2024', size: '856 KB' },
  { id: 4, name: 'Plan architectural.pdf', type: 'plan', project: 'Villa Moderne Rabat', date: '15 Dec 2023', size: '5.1 MB' },
  { id: 5, name: 'Rapport inspection.pdf', type: 'report', project: 'Villa Moderne Rabat', date: '25 Feb 2024', size: '1.8 MB' },
  { id: 6, name: 'Contrat principal.pdf', type: 'contract', project: 'Complex Marrakech Gardens', date: '8 Jan 2024', size: '3.2 MB' },
  { id: 7, name: 'Facture électricité.pdf', type: 'invoice', project: 'Complex Marrakech Gardens', date: '1 Mar 2024', size: '642 KB' },
  { id: 8, name: 'Plans techniques.pdf', type: 'plan', project: 'Résidence Al Andalus', date: '12 Jan 2024', size: '7.3 MB' },
];

const typeConfig: Record<DocumentType, { label: string; icon: any; className: string }> = {
  contract: { label: 'Contrat', icon: FileCheck, className: 'bg-background text-foreground border-border' },
  permit: { label: 'Permis', icon: FileCheck, className: 'bg-background text-foreground border-border' },
  invoice: { label: 'Facture', icon: File, className: 'bg-background text-foreground border-border' },
  plan: { label: 'Plan', icon: FileText, className: 'bg-background text-foreground border-border' },
  report: { label: 'Rapport', icon: FileWarning, className: 'bg-background text-foreground border-border' },
};

export default function Documents() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.project.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Documents</h1>
              <p className="text-sm text-muted-foreground font-light mt-1">
                {filteredDocuments.length} document{filteredDocuments.length > 1 ? 's' : ''}
              </p>
            </div>
            <Button className="self-start sm:self-auto">
              <Upload className="h-4 w-4 mr-2" strokeWidth={1.5} />
              Importer
            </Button>
          </div>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            <Input
              type="text"
              placeholder="Rechercher un document..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Documents List */}
          <Card className="divide-y divide-border/50">
            {filteredDocuments.map((doc) => {
              const config = typeConfig[doc.type];
              const Icon = config.icon;
              
              return (
                <div key={doc.id} className="p-4 hover:bg-secondary transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-foreground" strokeWidth={1.5} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{doc.name}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge className={config.className} variant="outline">
                          {config.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{doc.project}</span>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0 hidden sm:block">
                      <p className="text-sm text-foreground">{doc.size}</p>
                      <p className="text-xs text-muted-foreground font-light mt-1">{doc.date}</p>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="flex-shrink-0">
                      <Download className="h-4 w-4" strokeWidth={1.5} />
                    </Button>
                  </div>
                  
                  <div className="mt-2 sm:hidden flex gap-2 text-xs text-muted-foreground">
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{doc.date}</span>
                  </div>
                </div>
              );
            })}
          </Card>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Aucun document trouvé
              </h3>
              <p className="text-sm text-muted-foreground font-light">
                Essayez de modifier votre recherche
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
