import { ArrowRight, CheckCircle2, Shield, Clock, TrendingUp, Instagram, Calendar, Compass, Layers, Sparkles } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { SinglePricingCard } from '@/components/ui/single-pricing-card';
import heroBg from '@/assets/hero-bg.jpg';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns';
import { motion } from 'motion/react';
import { EarlyAdopterDialog } from '@/components/landing/EarlyAdopterDialog';
import { getTranslation, type Language } from '@/lib/translations';

const testimonials = [
  { text: "Aura PRO a transformé notre façon de gérer nos projets. Transparence totale, clients satisfaits.", image: "https://randomuser.me/api/portraits/men/1.jpg", name: "Ahmed Benali", role: "Promoteur Immobilier" },
  { text: "60% de temps gagné sur la gestion. Une interface qui rend la collaboration enfin simple.", image: "https://randomuser.me/api/portraits/women/2.jpg", name: "Sarah Mansouri", role: "Chef de Projet" },
  { text: "Suivi en temps réel. Nos clients adorent cette transparence inédite.", image: "https://randomuser.me/api/portraits/men/3.jpg", name: "Karim El Amrani", role: "Directeur Commercial" },
  { text: "Les notifications intelligentes nous font gagner un temps précieux au quotidien.", image: "https://randomuser.me/api/portraits/women/4.jpg", name: "Fatima Zahra", role: "Gestionnaire" },
  { text: "Tout est centralisé, accessible en un clic. Notre admin est devenue fluide.", image: "https://randomuser.me/api/portraits/men/5.jpg", name: "Mehdi Alaoui", role: "Responsable Admin" },
  { text: "Portefeuille doublé sans recruter. Une vraie révolution opérationnelle.", image: "https://randomuser.me/api/portraits/women/6.jpg", name: "Leila Tazi", role: "Directrice Générale" },
];
const firstColumn = testimonials.slice(0, 2);
const secondColumn = testimonials.slice(2, 4);
const thirdColumn = testimonials.slice(4, 6);

export default function Landing() {
  const { toast } = useToast();
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('fr');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const languages: Record<Language, { flag: string; name: string; short: string }> = {
    fr: { flag: '🇫🇷', name: 'Français', short: 'FR' },
    en: { flag: '🇬🇧', name: 'English', short: 'EN' },
    ar: { flag: '🇲🇦', name: 'العربية', short: 'AR' }
  };

  const waitlistSchema = z.object({
    email: z.string().trim().email({ message: "Adresse email invalide" }).max(255)
  });

  const handleWaitlistSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      waitlistSchema.parse({ email: waitlistEmail });
      setDialogOpen(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({ title: "Validation échouée", description: error.errors[0].message, variant: "destructive" });
      }
    }
  };

  const t = getTranslation(selectedLanguage);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EarlyAdopterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialEmail={waitlistEmail}
        language={selectedLanguage}
      />

      {/* Navigation - transparent over hero */}
      <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-white">Aura PRO</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-white/70 hover:text-white transition-colors">{t.nav.features}</a>
            <a href="#testimonials" className="text-sm text-white/70 hover:text-white transition-colors">{t.nav.testimonials}</a>
            <a href="#pricing" className="text-sm text-white/70 hover:text-white transition-colors">Tarifs</a>
            <a href="/contact" className="text-sm text-white/70 hover:text-white transition-colors">{t.nav.contact}</a>
            <a href="https://www.instagram.com/aura.pro.ai?igsh=MXF1ZHRncDB1eWthZQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
          <div
            role="radiogroup"
            aria-label="Langue"
            className="inline-flex items-center rounded-full border border-white/15 bg-white/5 backdrop-blur-md p-0.5"
          >
            {(Object.entries(languages) as [Language, typeof languages[Language]][]).map(([code, lang]) => {
              const active = selectedLanguage === code;
              return (
                <button
                  key={code}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelectedLanguage(code)}
                  title={lang.name}
                  className={`relative h-8 px-3 rounded-full text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors ${
                    active
                      ? 'bg-white text-black'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {lang.short}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Hero Section - full bleed image */}
      <section
        className="relative min-h-screen flex items-center px-6"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Darkening overlay for readability on the left side */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />

        <div className="relative z-10 max-w-7xl mx-auto w-full flex justify-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:max-w-xl lg:max-w-2xl text-left space-y-6"
          >
            <span className="inline-block text-xs uppercase tracking-[0.3em] text-white/60 font-medium">
              Real Estate Operating System
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-[1.05] text-white">
              {t.hero.title}
              <br />
              <span className="text-white/60 font-light">{t.hero.titleAccent}</span>
            </h1>
            <p className="text-base sm:text-lg text-white/70 font-light leading-relaxed max-w-xl">
              {t.hero.subtitle} {t.hero.subtitleContinued}
            </p>

            <form onSubmit={handleWaitlistSubmit} className="pt-4 flex flex-col sm:flex-row gap-3 justify-start">
              <Input
                type="email"
                placeholder={t.hero.emailPlaceholder}
                value={waitlistEmail}
                onChange={e => setWaitlistEmail(e.target.value)}
                required
                className="h-12 px-4 text-base rounded-xl border border-white/20 bg-white/10 backdrop-blur-md text-white placeholder:text-white/40 focus:border-white/40 sm:max-w-xs"
              />
              <ShimmerButton type="submit" className="h-12 px-6 text-sm font-semibold rounded-xl">
                <span className="flex items-center gap-2 text-white">
                  {t.hero.joinButton}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </ShimmerButton>
            </form>

            <p className="text-xs text-white/40 pt-2">
              Accès anticipé · –50% les 3 premiers mois
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision — Why · How · What */}
      <section className="py-32 px-6 bg-foreground text-background">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-20">
            <span className="text-xs uppercase tracking-[0.3em] text-background/50 font-medium">Notre raison d'être</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              Redonner du sens <span className="text-background/50 font-light">à la promotion immobilière.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Compass,
                label: 'La conviction',
                title: 'Construire mérite mieux que du chaos.',
                desc: 'Nous croyons que la transparence et la clarté ne sont pas des options — elles sont la base d\'une relation saine entre promoteurs et clients.',
              },
              {
                icon: Layers,
                label: 'La méthode',
                title: 'Un seul espace, une seule vérité.',
                desc: 'En centralisant projets, paiements et communications, nous remplaçons l\'éparpillement par une expérience fluide et maîtrisée de bout en bout.',
              },
              {
                icon: Sparkles,
                label: 'La promesse',
                title: 'La plateforme qui élève le métier.',
                desc: 'Aura PRO est l\'outil quotidien des promoteurs ambitieux : pilotage en temps réel, clients rassurés, équipes alignées.',
              },
            ].map((item, i) => (
              <div key={i} className="space-y-5">
                <item.icon className="h-6 w-6 text-background/80" strokeWidth={1.5} />
                <span className="block text-xs uppercase tracking-[0.25em] text-background/50 font-medium">{item.label}</span>
                <h3 className="text-2xl font-semibold leading-tight">{item.title}</h3>
                <p className="text-sm text-background/60 leading-relaxed font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - tight, no fluff */}
      <section id="features" className="py-32 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-20">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">Plateforme</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
              {t.features.title} <span className="text-muted-foreground font-light">{t.features.titleAccent}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {[
              { icon: Clock, title: t.features.feature1Title, desc: t.features.feature1Desc },
              { icon: Shield, title: t.features.feature2Title, desc: t.features.feature2Desc },
              { icon: TrendingUp, title: t.features.feature4Title, desc: t.features.feature4Desc },
              { icon: CheckCircle2, title: t.features.feature5Title, desc: t.features.feature5Desc },
              { icon: Shield, title: t.features.feature3Title, desc: t.features.feature3Desc },
              { icon: TrendingUp, title: t.features.feature6Title, desc: t.features.feature6Desc },
            ].map((feature, index) => (
              <div key={index} className="bg-background p-8 hover:bg-secondary/40 transition-colors">
                <feature.icon className="h-5 w-5 text-foreground mb-6" strokeWidth={1.5} />
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Product screenshot placeholder */}
          <div className="mt-24">
            <div className="relative mx-auto max-w-5xl rounded-3xl border border-border bg-gradient-to-b from-secondary/40 to-background overflow-hidden shadow-2xl">
              <div className="aspect-[16/10] flex items-center justify-center">
                <div className="text-center space-y-3 px-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/60 backdrop-blur text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Aperçu produit
                  </div>
                  <p className="text-sm text-muted-foreground font-light">Visuel de la plateforme à venir.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - single row, restrained */}
      <section id="testimonials" className="py-32 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">Clients</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
              {t.testimonials.title} <span className="text-muted-foreground font-light">{t.testimonials.titleAccent}</span>
            </h2>
          </div>
          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[520px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={18} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={22} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={20} />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">Tarification</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
              {t.pricing.title} <span className="text-muted-foreground font-light">{t.pricing.titleAccent}</span>
            </h2>
          </div>
          <div className="flex justify-center">
            <SinglePricingCard
              badge={t.pricing.badge}
              title={t.pricing.cardTitle}
              subtitle={t.pricing.cardSubtitle}
              price={`${t.pricing.pricePrefix} 99€${t.pricing.priceSuffix}`}
              priceNote={t.pricing.priceNote}
              benefits={[
                { icon: 'check', text: t.pricing.benefit1 },
                { icon: 'shield', text: t.pricing.benefit2 },
                { icon: 'heart', text: t.pricing.benefit3 },
              ]}
              features={[
                { text: t.features.feature1Title },
                { text: t.features.feature2Title },
                { text: t.features.feature3Title },
                { text: t.features.feature4Title },
                { text: t.features.feature5Title },
                { text: t.features.feature6Title },
              ]}
              primaryButton={{
                text: t.pricing.ctaButton,
                onClick: () => setDialogOpen(true),
              }}
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-foreground text-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-[1.05]">
            {t.earlyAdopters.title} <span className="text-background/50 font-light">{t.earlyAdopters.titleAccent}</span>
          </h2>
          <p className="text-lg text-background/70 mb-10 font-light max-w-xl mx-auto">
            {t.earlyAdopters.description}
          </p>
          <ShimmerButton onClick={() => setDialogOpen(true)} className="px-8 py-4 text-base font-semibold rounded-xl">
            <span className="flex items-center gap-2 text-white">
              {t.earlyAdopters.cta}
              <ArrowRight className="h-5 w-5" />
            </span>
          </ShimmerButton>
        </div>
      </section>

      {/* Insights / Articles */}
      <section className="py-32 px-6 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">Perspectives</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                Lectures choisies <span className="text-muted-foreground font-light">pour les promoteurs.</span>
              </h2>
            </div>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">
              Tous les articles <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { tag: 'Méthode', title: 'Pourquoi la transparence devient un avantage concurrentiel', read: '6 min de lecture' },
              { tag: 'Opérations', title: 'Réduire de 60% le temps administratif d\'un projet immobilier', read: '8 min de lecture' },
              { tag: 'Vision', title: 'Le promoteur de demain : moins de friction, plus de confiance', read: '5 min de lecture' },
            ].map((a, i) => (
              <a key={i} href="#" className="group block rounded-2xl border border-border overflow-hidden bg-background hover:border-foreground/30 transition-colors">
                <div className="aspect-[16/10] bg-gradient-to-br from-secondary to-secondary/40" />
                <div className="p-6 space-y-3">
                  <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium">{a.tag}</span>
                  <h3 className="text-lg font-semibold leading-snug group-hover:text-foreground transition-colors">{a.title}</h3>
                  <p className="text-xs text-muted-foreground">{a.read}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - dark */}
      <footer className="py-12 px-6 bg-foreground text-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">Aura PRO</span>
            <span className="text-background/50">© 2024</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-background/60">
            <a href="/contact" className="hover:text-background transition-colors">Contact</a>
            <a href="#" className="hover:text-background transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-background transition-colors">Confidentialité</a>
            <a href="https://www.instagram.com/aura.pro.ai?igsh=MXF1ZHRncDB1eWthZQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* Floating "Book a demo" bubble */}
      <a
        href="/contact"
        className="fixed bottom-6 right-6 z-50 group inline-flex items-center gap-2 pl-4 pr-5 py-3 rounded-full bg-foreground text-background shadow-2xl hover:scale-[1.03] transition-transform"
        aria-label="Réserver une démo"
      >
        <span className="h-8 w-8 rounded-full bg-background/15 flex items-center justify-center">
          <Calendar className="h-4 w-4" />
        </span>
        <span className="text-sm font-semibold">Réserver une démo</span>
      </a>
    </div>
  );
}
