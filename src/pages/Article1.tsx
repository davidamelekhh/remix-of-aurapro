import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import articleAnalytics from '@/assets/article-analytics.jpg';

export default function Article1() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            src={articleAnalytics} 
            alt="Analytics immobilier" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Header */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>5 min de lecture</span>
            <span>•</span>
            <span>Publié le 15 janvier 2025</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Comment améliorer la rentabilité de vos projets immobiliers
          </h1>
          <p className="text-xl text-muted-foreground">
            Découvrez les meilleures pratiques pour optimiser vos marges et réduire les coûts imprévus dans vos projets de construction.
          </p>
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          <h2>L'importance de la planification financière</h2>
          <p>
            Dans le secteur de la promotion immobilière, la rentabilité d'un projet repose sur une planification minutieuse et une gestion rigoureuse des coûts. Les dépassements budgétaires sont l'un des principaux défis auxquels font face les promoteurs.
          </p>

          <h2>Optimiser les coûts de construction</h2>
          <p>
            La première étape pour améliorer la rentabilité consiste à identifier les postes de dépenses les plus importants. Une analyse détaillée des coûts de construction permet de repérer les opportunités d'économies sans compromettre la qualité.
          </p>

          <h3>Négociation avec les fournisseurs</h3>
          <p>
            Établir des relations solides avec vos fournisseurs peut vous permettre d'obtenir de meilleurs tarifs. Les contrats à long terme et les achats en volume sont des leviers efficaces pour réduire les coûts.
          </p>

          <h2>Le suivi en temps réel : un atout majeur</h2>
          <p>
            L'utilisation d'outils de gestion de projet permet de suivre l'avancement en temps réel et d'identifier rapidement les écarts par rapport au budget initial. Cette visibilité permet d'agir proactivement avant que les problèmes ne deviennent trop coûteux.
          </p>

          <h2>Réduire les délais de livraison</h2>
          <p>
            Chaque jour de retard représente un coût supplémentaire. Une meilleure coordination entre les différents corps de métier et l'anticipation des risques permet de respecter les délais et d'optimiser la rentabilité.
          </p>

          <h2>Conclusion</h2>
          <p>
            L'amélioration de la rentabilité passe par une approche globale combinant planification rigoureuse, outils de suivi performants et optimisation continue des processus. Les technologies modernes offrent aujourd'hui des solutions pour atteindre ces objectifs.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-secondary/30 rounded-3xl text-center space-y-4">
          <h3 className="text-2xl font-bold">
            Prêt à optimiser vos projets ?
          </h3>
          <p className="text-muted-foreground">
            Découvrez comment Aura PRO peut vous aider à améliorer la rentabilité de vos projets immobiliers.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            En savoir plus
          </Button>
        </div>
      </article>
    </div>
  );
}
