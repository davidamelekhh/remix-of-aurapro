import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, BarChart3, Bell, FolderOpen, Users, Shield, Clock, TrendingUp, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SinglePricingCard } from '@/components/ui/single-pricing-card';
import auraLogo from '@/assets/aura-pro-logo.png';
import heroProfessional from '@/assets/hero-professional.png';
import heroAfter from '@/assets/hero-after.png';
import problemCommunication from '@/assets/problem-communication.png';
import problemVisibility from '@/assets/problem-visibility.png';
import problemAdmin from '@/assets/problem-admin.png';
import solutionDashboard from '@/assets/solution-dashboard.png';
import { BentoCard } from '@/components/ui/bento';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns';
import { BeforeAfterSlider } from '@/components/ui/before-after-slider';
import { motion } from 'motion/react';

const testimonials = [
  {
    text: "Aura PRO a complètement transformé notre manière de gérer nos projets immobiliers. La transparence et la communication avec nos clients n'ont jamais été aussi fluides.",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    name: "Ahmed Benali",
    role: "Promoteur Immobilier",
  },
  {
    text: "Grâce à Aura PRO, nous avons réduit nos délais de gestion de 60%. L'interface intuitive facilite la collaboration avec toutes nos équipes.",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    name: "Sarah Mansouri",
    role: "Chef de Projet",
  },
  {
    text: "La plateforme nous permet de suivre chaque étape en temps réel. Nos clients apprécient vraiment cette transparence totale.",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    name: "Karim El Amrani",
    role: "Directeur Commercial",
  },
  {
    text: "Les notifications intelligentes nous font gagner un temps précieux. Nous ne manquons plus jamais une échéance importante.",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    name: "Fatima Zahra",
    role: "Gestionnaire de Projets",
  },
  {
    text: "L'espace documentaire sécurisé a simplifié toute notre gestion administrative. Tout est centralisé et accessible en un clic.",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    name: "Mehdi Alaoui",
    role: "Responsable Administratif",
  },
  {
    text: "Aura PRO nous a permis de doubler notre portefeuille clients sans augmenter nos effectifs. Une vraie révolution.",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Leila Tazi",
    role: "Directrice Générale",
  },
  {
    text: "En tant que client, j'apprécie la visibilité totale sur l'avancement de mon projet. Je recommande vivement.",
    image: "https://randomuser.me/api/portraits/men/7.jpg",
    name: "Youssef Berrada",
    role: "Client Investisseur",
  },
  {
    text: "Le suivi automatisé et les analytics nous permettent de prendre de meilleures décisions stratégiques.",
    image: "https://randomuser.me/api/portraits/women/8.jpg",
    name: "Nadia Chraibi",
    role: "Analyste Business",
  },
  {
    text: "Une solution complète qui a vraiment compris les besoins du secteur immobilier marocain. Excellent support client.",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    name: "Omar Idrissi",
    role: "Promoteur",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function Landing() {
  const { toast } = useToast();
  const [waitlistEmail, setWaitlistEmail] = useState('');

  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('waitlist')
        .insert([{ email: waitlistEmail }]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Déjà inscrit",
            description: "Cet email est déjà sur la liste d'attente.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Inscription réussie !",
        description: "Vous êtes maintenant sur la liste d'attente. Nous vous contacterons bientôt.",
      });
      
      setWaitlistEmail('');
    } catch (error) {
      console.error('Error joining waitlist:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">Aura PRO</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#solution" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Solution</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fonctionnalités</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Témoignages</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
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
          <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto pt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Votre email professionnel"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                required
                className="flex-1 px-6 py-6 text-lg rounded-xl border-2 focus:border-primary transition-all"
              />
              <Button 
                type="submit"
                size="lg" 
                className="group relative overflow-hidden bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Rejoindre
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-3">
              Soyez parmi les premiers à découvrir Aura Pro
            </p>
          </form>
        </div>

        {/* Before/After Comparison */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="rounded-3xl border border-border shadow-float overflow-hidden">
            <BeforeAfterSlider
              beforeImage={heroProfessional}
              afterImage={heroAfter}
              beforeAlt="Avant Aura PRO"
              afterAlt="Avec Aura PRO"
            />
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
                <img 
                  src={problemCommunication} 
                  alt="Communication fragmentée" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              }
              className="lg:col-span-1"
            />
            <BentoCard
              eyebrow="Problème"
              title="Manque de visibilité"
              description="Impossible de suivre l'avancement réel des projets sans multiplier les appels et réunions."
              graphic={
                <img 
                  src={problemVisibility} 
                  alt="Manque de visibilité" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              }
              className="lg:col-span-1"
            />
            <BentoCard
              eyebrow="Problème"
              title="Gestion manuelle inefficace"
              description="Retards, erreurs et perte de temps causés par des processus administratifs obsolètes."
              graphic={
                <img 
                  src={problemAdmin} 
                  alt="Gestion manuelle inefficace" 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              }
              className="lg:col-span-1"
            />
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-32 px-6 bg-foreground text-background relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
            Les questions que vous entendez chaque jour
          </h2>
          
          <div className="space-y-8 mb-16">
            {[
              "Où en est mon projet exactement ?",
              "Pourquoi ce retard n'a pas été signalé ?",
              "Quand recevrai-je le prochain paiement ?",
              "Où sont les documents signés ?",
              "Qui s'occupe de cette partie du chantier ?",
              "Pourquoi les équipes ne sont pas alignées ?",
              "Comment je peux suivre l'avancement en temps réel ?"
            ].map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.5,
                  ease: [0.16, 1, 0.3, 1]
                }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-2xl md:text-3xl font-light text-background/80 text-center"
              >
                {question}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 3.5,
              ease: [0.16, 1, 0.3, 1]
            }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-3xl md:text-4xl font-bold text-background">
              Avec Aura PRO, vous avez toutes les réponses.
            </p>
          </motion.div>
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
              <div className="aspect-square rounded-3xl border border-border shadow-float overflow-hidden">
                <img 
                  src={solutionDashboard} 
                  alt="Tableau de bord Aura PRO" 
                  className="w-full h-full object-cover"
                />
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

      {/* Pricing Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-orange-50/10 to-background"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Investissez dans votre réussite
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une solution complète pour transformer votre gestion immobilière
            </p>
          </div>

          <SinglePricingCard
            badge="Offre Premium"
            title="Aura Pro"
            subtitle="La plateforme tout-en-un pour les professionnels de l'immobilier"
            price="199€"
            benefits={[
              { icon: 'check', text: 'Projets et clients illimités' },
              { icon: 'shield', text: 'Sécurité et conformité garanties' },
              { icon: 'heart', text: 'Support premium 7j/7' }
            ]}
            features={[
              { text: 'Tableau de bord temps réel avec analytics avancés' },
              { text: 'Gestion complète des projets et des équipes' },
              { text: 'Suivi financier détaillé et rapports automatiques' },
              { text: 'Communication client intégrée et portail dédié' },
              { text: 'Espace documentaire sécurisé avec versioning' },
              { text: 'Notifications intelligentes et alertes personnalisées' },
              { text: 'Calendrier de projet et gestion des échéances' },
              { text: 'Gestion des paiements et factures automatisées' },
              { text: 'Application mobile iOS et Android' },
              { text: 'Intégrations avec vos outils favoris' },
              { text: 'Mises à jour régulières et nouvelles fonctionnalités' },
              { text: 'Formation et onboarding personnalisé' }
            ]}
            primaryButton={{
              text: 'Contactez-nous',
              onClick: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
            }}
            secondaryButton={{
              text: 'En savoir plus',
              onClick: () => window.open('#features', '_self')
            }}
          />
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
      <section id="testimonials" className="py-20 px-6 bg-background relative">
        <div className="container z-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
          >
            <div className="flex justify-center">
              <div className="border py-1 px-4 rounded-lg text-sm">Témoignages</div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-5 text-center">
              Ils utilisent déjà Aura PRO
            </h2>
            <p className="text-center mt-5 text-muted-foreground text-lg">
              Découvrez ce que nos clients disent de nous.
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
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
