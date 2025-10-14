import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, BarChart3, Bell, FolderOpen, Users, Shield, Clock, TrendingUp, MessageSquare } from 'lucide-react';
import auraLogo from '@/assets/aura-pro-logo.png';
import { BentoCard } from '@/components/ui/bento';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={auraLogo} alt="Aura PRO" className="h-8 w-8 object-contain" />
            <span className="text-lg font-semibold">Aura PRO</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#solution" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Solution</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Témoignages</a>
            <Button size="sm">Demander une démo</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            La gestion immobilière
            <br />
            <span className="text-muted-foreground">réinventée.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Suivez chaque projet. Simplifiez chaque étape.
            <br />
            La plateforme qui transforme votre manière de gérer l'immobilier.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" className="gap-2">
              Découvrir Aura PRO
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Demander une démo
            </Button>
          </div>
          {/* Placeholder for demo video/image */}
          <div className="mt-16 relative">
            <div className="aspect-video bg-muted rounded-3xl border border-border shadow-float flex items-center justify-center">
              <p className="text-muted-foreground">Espace pour image/vidéo de démonstration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Les défis du secteur immobilier
          </h2>
          <p className="max-w-3xl text-xl text-muted-foreground mb-16">
            Les problèmes qui ralentissent votre productivité au quotidien.
          </p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <BentoCard
              eyebrow="Problème"
              title="Communication fragmentée"
              description="Emails perdus, messages dispersés et informations difficiles à retrouver entre clients et promoteurs."
              graphic={
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20" />
              }
              className="lg:col-span-1"
            />
            <BentoCard
              eyebrow="Problème"
              title="Manque de visibilité"
              description="Impossible de suivre l'avancement réel des projets sans multiplier les appels et réunions."
              graphic={
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-yellow-500/20" />
              }
              className="lg:col-span-1"
            />
            <BentoCard
              eyebrow="Problème"
              title="Gestion manuelle inefficace"
              description="Retards, erreurs et perte de temps causés par des processus administratifs obsolètes."
              graphic={
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-red-500/20" />
              }
              className="lg:col-span-1"
            />
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                Imaginez ne plus jamais perdre le contrôle d'un projet.
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Aura PRO centralise toutes vos interactions, automatise vos tâches répétitives et clarifie chaque étape de vos projets immobiliers.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Une plateforme unique où promoteurs et clients collaborent en temps réel, avec une visibilité totale et une communication fluide.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Tableau de bord
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Notifications IA
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Documents partagés
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  Suivi en temps réel
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-muted rounded-3xl border border-border shadow-float flex items-center justify-center">
                <p className="text-muted-foreground text-center px-8">Espace pour illustration de la solution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Des résultats concrets
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-card rounded-3xl p-8 border border-border text-center space-y-2">
              <div className="text-5xl font-bold">+60%</div>
              <p className="text-muted-foreground">de productivité</p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border text-center space-y-2">
              <div className="text-5xl font-bold">0</div>
              <p className="text-muted-foreground">email perdu</p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border text-center space-y-2">
              <div className="text-5xl font-bold">100%</div>
              <p className="text-muted-foreground">de transparence client</p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border text-center space-y-2">
              <div className="text-5xl font-bold">2x</div>
              <p className="text-muted-foreground">plus de satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Une plateforme complète
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-16">
            pour les professionnels de l'immobilier
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-3xl p-8 border border-border space-y-4 hover:shadow-float transition-all duration-300">
              <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
                <FolderOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Gestion des projets</h3>
              <p className="text-muted-foreground leading-relaxed">
                Créez, organisez et suivez vos projets immobiliers avec une vue d'ensemble claire et des étapes détaillées.
              </p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border space-y-4 hover:shadow-float transition-all duration-300">
              <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Suivi client automatisé</h3>
              <p className="text-muted-foreground leading-relaxed">
                Gardez vos clients informés automatiquement à chaque étape, avec notifications et mises à jour en temps réel.
              </p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border space-y-4 hover:shadow-float transition-all duration-300">
              <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Notifications intelligentes</h3>
              <p className="text-muted-foreground leading-relaxed">
                Recevez uniquement les alertes importantes grâce à notre système de notifications piloté par IA.
              </p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border space-y-4 hover:shadow-float transition-all duration-300">
              <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Interface collaborative</h3>
              <p className="text-muted-foreground leading-relaxed">
                Communiquez facilement avec vos équipes et vos clients depuis une seule plateforme centralisée.
              </p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border space-y-4 hover:shadow-float transition-all duration-300">
              <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Analytics en temps réel</h3>
              <p className="text-muted-foreground leading-relaxed">
                Analysez vos performances avec des tableaux de bord détaillés et prenez des décisions éclairées.
              </p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border space-y-4 hover:shadow-float transition-all duration-300">
              <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Espace documentaire sécurisé</h3>
              <p className="text-muted-foreground leading-relaxed">
                Stockez et partagez vos documents en toute sécurité avec un accès contrôlé et une traçabilité complète.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Ils utilisent déjà Aura PRO
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-3xl p-8 border border-border space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-muted rounded-full"></div>
                  <div>
                    <div className="font-semibold">Nom Prénom</div>
                    <div className="text-sm text-muted-foreground">Promoteur Immobilier</div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed italic">
                  "Citation témoignage à personnaliser. Aura PRO a transformé notre manière de travailler."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Aura PRO Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Pourquoi Aura PRO
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Nous aidons les acteurs de l'immobilier à travailler plus intelligemment, pas plus durement.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Aura PRO automatise l'administratif pour redonner du temps à l'humain. Notre mission est simple : simplifier la complexité de la gestion immobilière pour que vous puissiez vous concentrer sur ce qui compte vraiment — vos projets et vos clients.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-foreground text-background">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Prêt à passer à la nouvelle ère
            <br />
            de la gestion immobilière ?
          </h2>
          <p className="text-xl text-background/80 max-w-2xl mx-auto">
            Rejoignez les promoteurs qui ont déjà fait le choix de l'excellence avec Aura PRO.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" variant="secondary" className="gap-2">
              Réserver une démo
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-background/20 text-background hover:bg-background/10">
              Nous contacter
            </Button>
          </div>
          {/* Placeholder for visual */}
          <div className="mt-12 relative">
            <div className="aspect-video bg-background/10 rounded-3xl border border-background/20 flex items-center justify-center">
              <p className="text-background/60">Espace pour visuel ou illustration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img src={auraLogo} alt="Aura PRO" className="h-8 w-8 object-contain" />
              <span className="font-semibold">Aura PRO</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Aura PRO. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
