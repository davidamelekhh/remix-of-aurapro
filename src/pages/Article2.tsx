import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import articleConstruction from '@/assets/article-construction.jpg';

export default function Article2() {
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
            src={articleConstruction} 
            alt="Construction immobilière" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Header */}
        <div className="space-y-4 mb-12">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>7 min de lecture</span>
            <span>•</span>
            <span>Publié le 10 janvier 2025</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Les tendances de la promotion immobilière en 2025
          </h1>
          <p className="text-xl text-muted-foreground">
            Analyse des nouvelles attentes des clients et des évolutions technologiques qui transforment le secteur.
          </p>
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          <h2>Un secteur en pleine mutation</h2>
          <p>
            L'année 2025 marque un tournant décisif pour la promotion immobilière. Les attentes des clients évoluent rapidement, et les professionnels doivent s'adapter pour rester compétitifs.
          </p>

          <h2>La transparence comme priorité</h2>
          <p>
            Les acquéreurs d'aujourd'hui exigent une visibilité totale sur l'avancement de leur projet. Fini le temps où un simple point mensuel suffisait : les clients veulent suivre leur investissement en temps réel.
          </p>

          <h3>Le rôle de la technologie</h3>
          <p>
            Les plateformes digitales permettent désormais aux promoteurs d'offrir cette transparence sans effort supplémentaire. Tableaux de bord en ligne, notifications automatiques et partage de documents sécurisé sont devenus la norme.
          </p>

          <h2>La durabilité au cœur des préoccupations</h2>
          <p>
            Les projets éco-responsables ne sont plus un simple argument marketing. Les clients recherchent activement des biens respectueux de l'environnement, avec des certifications énergétiques performantes.
          </p>

          <h2>L'importance de la communication</h2>
          <p>
            Une communication fluide et régulière est devenue un facteur déterminant dans la satisfaction client. Les promoteurs qui investissent dans des outils de communication modernes bénéficient d'un avantage concurrentiel significatif.
          </p>

          <h2>Vers plus d'automatisation</h2>
          <p>
            L'automatisation des tâches administratives permet aux équipes de se concentrer sur l'essentiel : la relation client et la qualité de construction. Cette tendance devrait s'accentuer dans les années à venir.
          </p>

          <h2>Conclusion</h2>
          <p>
            Les promoteurs qui sauront s'adapter à ces nouvelles tendances - transparence, durabilité, communication et automatisation - seront les leaders de demain. La transformation digitale n'est plus une option, c'est une nécessité.
          </p>
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 bg-secondary/30 rounded-3xl text-center space-y-4">
          <h3 className="text-2xl font-bold">
            Adoptez les nouvelles tendances
          </h3>
          <p className="text-muted-foreground">
            Rejoignez les promoteurs qui ont fait le choix de l'innovation avec Aura PRO.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            Découvrir Aura PRO
          </Button>
        </div>
      </article>
    </div>
  );
}
