import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import articleDigital from '@/assets/article-digital.jpg';

export default function Article3() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Image */}
        <div className="aspect-video rounded-3xl overflow-hidden mb-8">
          <img 
            src={articleDigital} 
            alt="Transformation digitale" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Header */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>6 min de lecture</span>
            <span>•</span>
            <span>Publié le 5 janvier 2025</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Digitalisation : comment transformer votre gestion de projet
          </h1>
          <p className="text-xl text-muted-foreground">
            Guide pratique pour passer d'une gestion traditionnelle à une approche digitale moderne et efficace.
          </p>
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          <h2>Le défi de la transformation digitale</h2>
          <p>
            Passer d'une gestion traditionnelle à une approche digitale peut sembler intimidant. Pourtant, cette transition est devenue incontournable pour rester compétitif dans le secteur immobilier.
          </p>

          <h2>Identifier les points de friction</h2>
          <p>
            La première étape consiste à identifier les processus qui vous font perdre du temps : gestion documentaire dispersée, communication fragmentée, suivi manuel des échéances... Ces points de friction sont autant d'opportunités d'amélioration.
          </p>

          <h3>L'importance d'une vision globale</h3>
          <p>
            Plutôt que d'adopter des outils disparates, privilégiez une solution intégrée qui centralise l'ensemble de votre gestion de projet. Cette approche garantit une cohérence et facilite l'adoption par vos équipes.
          </p>

          <h2>Former vos équipes</h2>
          <p>
            La réussite d'une transformation digitale repose avant tout sur l'adhésion des équipes. Un accompagnement personnalisé et une formation adaptée sont essentiels pour garantir une adoption réussie.
          </p>

          <h2>Mesurer les bénéfices</h2>
          <p>
            Les premiers résultats d'une digitalisation efficace se font rapidement sentir : gain de temps, réduction des erreurs, amélioration de la satisfaction client. Ces indicateurs doivent être suivis régulièrement pour ajuster votre stratégie.
          </p>

          <h2>Anticiper l'évolution</h2>
          <p>
            La transformation digitale n'est pas un projet ponctuel mais un processus continu. Choisissez des solutions évolutives qui s'adapteront à vos besoins futurs et aux innovations technologiques.
          </p>

          <h2>Conclusion</h2>
          <p>
            La digitalisation de votre gestion de projet n'est pas une question de technologie, mais d'efficacité et de compétitivité. Les promoteurs qui franchissent ce cap aujourd'hui prennent une longueur d'avance décisive.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-secondary/30 rounded-3xl text-center space-y-4">
          <h3 className="text-2xl font-bold">
            Prêt à digitaliser votre gestion ?
          </h3>
          <p className="text-muted-foreground">
            Découvrez comment Aura PRO facilite votre transformation digitale.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            Commencer maintenant
          </Button>
        </div>
      </article>
    </div>
  );
}
