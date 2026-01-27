import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, BarChart3, Bell, FolderOpen, Users, Shield, Clock, TrendingUp, MessageSquare, ChevronDown, Instagram } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { SinglePricingCard } from '@/components/ui/single-pricing-card';
import { useNavigate } from 'react-router-dom';
import auraLogo from '@/assets/aura-pro-logo.png';
import neonLogo from '@/assets/neon-logo.png';
import heroProfessional from '@/assets/hero-professional.png';
import heroAfter from '@/assets/hero-after.png';
import dashboardLaptop from '@/assets/dashboard-laptop.png';
import solutionDashboard from '@/assets/solution-dashboard.png';
import articleAnalytics from '@/assets/article-analytics.jpg';
import articleConstruction from '@/assets/article-construction.jpg';
import articleDigital from '@/assets/article-digital.jpg';
import earlyAdoptersBanner from '@/assets/early-adopters-banner.png';
import networkProblemImg from '@/assets/problem-network.png';
import visibilityProblemImg from '@/assets/problem-visibility-new.png';
import gearProblemImg from '@/assets/problem-gear.png';
import { BentoCard } from '@/components/ui/bento';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns';
import { BeforeAfterSlider } from '@/components/ui/before-after-slider';
import { motion } from 'motion/react';
import { EarlyAdopterDialog } from '@/components/landing/EarlyAdopterDialog';
import { getTranslation, type Language } from '@/lib/translations';
import { DotScreenShader } from '@/components/ui/dot-shader-background';

const testimonials = [{
  text: "Aura PRO a complètement transformé notre manière de gérer nos projets immobiliers. La transparence et la communication avec nos clients n'ont jamais été aussi fluides.",
  image: "https://randomuser.me/api/portraits/men/1.jpg",
  name: "Ahmed Benali",
  role: "Promoteur Immobilier"
}, {
  text: "Grâce à Aura PRO, nous avons réduit nos délais de gestion de 60%. L'interface intuitive facilite la collaboration avec toutes nos équipes.",
  image: "https://randomuser.me/api/portraits/women/2.jpg",
  name: "Sarah Mansouri",
  role: "Chef de Projet"
}, {
  text: "La plateforme nous permet de suivre chaque étape en temps réel. Nos clients apprécient vraiment cette transparence totale.",
  image: "https://randomuser.me/api/portraits/men/3.jpg",
  name: "Karim El Amrani",
  role: "Directeur Commercial"
}, {
  text: "Les notifications intelligentes nous font gagner un temps précieux. Nous ne manquons plus jamais une échéance importante.",
  image: "https://randomuser.me/api/portraits/women/4.jpg",
  name: "Fatima Zahra",
  role: "Gestionnaire de Projets"
}, {
  text: "L'espace documentaire sécurisé a simplifié toute notre gestion administrative. Tout est centralisé et accessible en un clic.",
  image: "https://randomuser.me/api/portraits/men/5.jpg",
  name: "Mehdi Alaoui",
  role: "Responsable Administratif"
}, {
  text: "Aura PRO nous a permis de doubler notre portefeuille clients sans augmenter nos effectifs. Une vraie révolution.",
  image: "https://randomuser.me/api/portraits/women/6.jpg",
  name: "Leila Tazi",
  role: "Directrice Générale"
}, {
  text: "En tant que client, j'apprécie la visibilité totale sur l'avancement de mon projet. Je recommande vivement.",
  image: "https://randomuser.me/api/portraits/men/7.jpg",
  name: "Youssef Berrada",
  role: "Client Investisseur"
}, {
  text: "Le suivi automatisé et les analytics nous permettent de prendre de meilleures décisions stratégiques.",
  image: "https://randomuser.me/api/portraits/women/8.jpg",
  name: "Nadia Chraibi",
  role: "Analyste Business"
}, {
  text: "Une solution complète qui a vraiment compris les besoins du secteur immobilier marocain. Excellent support client.",
  image: "https://randomuser.me/api/portraits/men/9.jpg",
  name: "Omar Idrissi",
  role: "Promoteur"
}];
const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function Landing() {
  const { toast } = useToast();
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('fr');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [dialogOpen, setDialogOpen] = useState(false);
  const languages = {
    fr: { flag: '🇫🇷', name: 'Français' },
    en: { flag: '🇬🇧', name: 'English' },
    ar: { flag: '🇲🇦', name: 'العربية' }
  };
  
  const waitlistSchema = z.object({
    email: z.string().trim().email({ message: "Adresse email invalide" }).max(255, { message: "Email trop long" })
  });

  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Validate input
      const validated = waitlistSchema.parse({ email: waitlistEmail });

      // Open dialog with the email
      setDialogOpen(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation échouée",
          description: error.errors[0].message,
          variant: "destructive"
        });
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
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-xl border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">Aura PRO</span>
            <span className="text-sm text-muted-foreground">•   worldwide</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#solution" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.solution}</a>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.features}</a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.testimonials}</a>
            <div className="flex items-center gap-2">
              <a href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t.nav.contact}</a>
              <a href="https://www.instagram.com/aura.pro.ai?igsh=MXF1ZHRncDB1eWthZQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
          {/* Language Selector - Mobile */}
          <div className="md:hidden relative">
            <button type="button" onClick={() => setLanguageMenuOpen(!languageMenuOpen)} className="h-10 w-10 rounded-lg border bg-background hover:bg-secondary transition-all flex items-center justify-center text-xl">
              {languages[selectedLanguage].flag}
            </button>
            
            {languageMenuOpen && (
              <div className="absolute top-full right-0 mt-2 bg-card border-2 border-border rounded-xl shadow-lg overflow-hidden z-50 min-w-[160px]">
                {Object.entries(languages).map(([code, lang]) => (
                  <button 
                    key={code} 
                    type="button" 
                    onClick={() => {
                      setSelectedLanguage(code as Language);
                      setLanguageMenuOpen(false);
                    }} 
                    className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 bg-card"
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ delay: 0.1, duration: 0.6 }} 
            className="mb-12 flex justify-center"
          >
            <img src={neonLogo} alt="Aura PRO" className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover mx-auto" />
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-center px-4">
            {t.hero.title}
            <br />
            <span className="font-medium text-muted-foreground">{t.hero.titleAccent}</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed text-center px-4">
            {t.hero.subtitle}
            <br className="hidden sm:block" />
            <span className="sm:inline"> </span>{t.hero.subtitleContinued}
          </p>
          <form onSubmit={handleWaitlistSubmit} className="max-w-3xl mx-auto pt-4 px-4">
            <p className="text-center text-sm font-medium text-muted-foreground mb-3">
              Rejoignez la liste d'attente
            </p>
            {/* Email/Tél selector - Mobile only, centered above input */}
            <div className="flex justify-center mb-3 sm:hidden">
              <div className="flex gap-1 bg-muted/50 backdrop-blur-sm rounded-lg p-1">
                <button 
                  type="button" 
                  onClick={() => setContactType('email')} 
                  className={`px-3 py-1.5 text-xs rounded transition-all ${contactType === 'email' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t.hero.email}
                </button>
                <button 
                  type="button" 
                  onClick={() => setContactType('phone')} 
                  className={`px-3 py-1.5 text-xs rounded transition-all ${contactType === 'phone' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  {t.hero.phone}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Language Selector - Desktop only */}
              <div className="relative hidden md:block">
                <button 
                  type="button" 
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)} 
                  className="h-[56px] w-[56px] rounded-xl border-2 bg-background hover:bg-secondary transition-all flex items-center justify-center text-2xl"
                >
                  {languages[selectedLanguage].flag}
                </button>
                
                {languageMenuOpen && (
                  <div className="absolute top-full mt-2 bg-card border-2 border-border rounded-xl shadow-lg overflow-hidden z-50 min-w-[160px]">
                    {Object.entries(languages).map(([code, lang]) => (
                      <button 
                        key={code} 
                        type="button" 
                        onClick={() => {
                          setSelectedLanguage(code as Language);
                          setLanguageMenuOpen(false);
                        }} 
                        className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 bg-card"
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 relative">
                {/* Email/Tél selector - Desktop only, inside input */}
                <div className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 gap-1 bg-muted/50 backdrop-blur-sm rounded-lg p-1">
                  <button 
                    type="button" 
                    onClick={() => setContactType('email')} 
                    className={`px-2 py-1 text-xs rounded transition-all ${contactType === 'email' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {t.hero.email}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setContactType('phone')} 
                    className={`px-2 py-1 text-xs rounded transition-all ${contactType === 'phone' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {t.hero.phone}
                  </button>
                </div>
                <Input 
                  type={contactType === 'email' ? 'email' : 'tel'} 
                  placeholder={contactType === 'email' ? t.hero.emailPlaceholder : t.hero.phonePlaceholder} 
                  value={waitlistEmail} 
                  onChange={e => setWaitlistEmail(e.target.value)} 
                  required 
                  className="w-full pl-4 sm:pl-28 pr-4 py-4 sm:py-6 text-base sm:text-lg rounded-xl border-2 focus:border-primary transition-all text-center sm:text-left" 
                />
              </div>
              <ShimmerButton type="submit" className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-xl w-full sm:w-auto">
                <span className="flex items-center gap-2">
                  {t.hero.joinButton}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </ShimmerButton>
            </div>
          </form>
        </div>

        {/* Before/After Comparison */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="rounded-3xl border border-border shadow-float overflow-hidden">
            <BeforeAfterSlider beforeImage={heroProfessional} afterImage={heroAfter} beforeAlt={t.hero.beforeAlt} afterAlt={t.hero.afterAlt} />
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {t.problems.title} <span className="font-medium">{t.problems.titleAccent}</span>
          </h2>
          <p className="max-w-3xl text-xl text-muted-foreground mb-16">
            {t.problems.subtitle}
          </p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <BentoCard 
              eyebrow={t.problems.eyebrow} 
              title={t.problems.problem1Title} 
              description={t.problems.problem1Desc} 
              graphic={<img src={networkProblemImg} alt="" className="absolute inset-0 w-full h-full object-cover" />} 
              className="lg:col-span-1 [&_h1]:!text-white [&_p]:!text-white" 
            />
            <BentoCard 
              eyebrow={t.problems.eyebrow} 
              title={t.problems.problem2Title} 
              description={t.problems.problem2Desc} 
              graphic={<img src={visibilityProblemImg} alt="" className="absolute inset-0 w-full h-full object-cover" />} 
              className="lg:col-span-1 [&_h1]:!text-white [&_p]:!text-white" 
            />
            <BentoCard 
              eyebrow={t.problems.eyebrow} 
              title={t.problems.problem3Title} 
              description={t.problems.problem3Desc} 
              graphic={<img src={gearProblemImg} alt="" className="absolute inset-0 w-full h-full object-cover" />} 
              className="lg:col-span-1 [&_h1]:!text-white [&_p]:!text-white" 
            />
          </div>
        </div>
      </section>

      {/* Questions Section */}
      <section className="py-32 px-6 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0">
          <DotScreenShader />
        </div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-20">
            {t.questions.title} <span className="font-medium">{t.questions.titleAccent}</span>
          </h2>
          
          <div className="space-y-8 mb-16">
            {[t.questions.q1, t.questions.q2, t.questions.q3, t.questions.q4, t.questions.q5, t.questions.q6, t.questions.q7].map((question, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }} 
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} 
                transition={{ duration: 0.8, delay: index * 0.5, ease: [0.16, 1, 0.3, 1] }} 
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
            transition={{ duration: 0.6, delay: 0.3 }} 
            viewport={{ once: true }} 
            className="text-center"
          >
            <p className="text-3xl md:text-4xl font-bold text-background mb-6">
              {t.questions.answer}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.solution.title} <span className="font-medium">{t.solution.titleAccent}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.solution.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              {[
                { icon: BarChart3, title: t.solution.feature1Title, desc: t.solution.feature1Desc },
                { icon: Bell, title: t.solution.feature2Title, desc: t.solution.feature2Desc },
                { icon: FolderOpen, title: t.solution.feature3Title, desc: t.solution.feature3Desc },
                { icon: MessageSquare, title: t.solution.feature4Title, desc: t.solution.feature4Desc },
              ].map((feature, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-secondary/50 transition-colors">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <img src={solutionDashboard} alt="Dashboard" className="rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.features.title} <span className="font-medium">{t.features.titleAccent}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {'subtitle' in t.features ? (t.features as any).subtitle : 'pour les professionnels de l\'immobilier'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: 'feature1Title' in t.features ? (t.features as any).feature1Title : 'Gestion des projets', desc: 'feature1Desc' in t.features ? (t.features as any).feature1Desc : t.features.feature1 },
              { icon: Shield, title: 'feature2Title' in t.features ? (t.features as any).feature2Title : 'Suivi client', desc: 'feature2Desc' in t.features ? (t.features as any).feature2Desc : t.features.feature2 },
              { icon: Users, title: 'feature3Title' in t.features ? (t.features as any).feature3Title : 'Notifications', desc: 'feature3Desc' in t.features ? (t.features as any).feature3Desc : t.features.feature3 },
              { icon: TrendingUp, title: 'feature4Title' in t.features ? (t.features as any).feature4Title : 'Collaboration', desc: 'feature4Desc' in t.features ? (t.features as any).feature4Desc : t.features.feature4 },
              { icon: CheckCircle2, title: 'feature5Title' in t.features ? (t.features as any).feature5Title : 'Analytics', desc: 'feature5Desc' in t.features ? (t.features as any).feature5Desc : '' },
              { icon: BarChart3, title: 'feature6Title' in t.features ? (t.features as any).feature6Title : 'Documents', desc: 'feature6Desc' in t.features ? (t.features as any).feature6Desc : '' },
            ].map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-2xl border border-border hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.testimonials.title} <span className="font-medium">{t.testimonials.titleAccent}</span>
            </h2>
          </div>

          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[738px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.pricing.title} <span className="font-medium">{t.pricing.titleAccent}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {'subtitle' in t.pricing ? (t.pricing as any).subtitle : ''}
            </p>
          </div>

          <div className="flex justify-center">
            <SinglePricingCard
              title={'planTitle' in t.pricing ? (t.pricing as any).planTitle : 'Aura Pro'}
              price="99€"
              period={'period' in t.pricing ? (t.pricing as any).period : '/mois'}
              features={[
                'feature1' in t.pricing ? (t.pricing as any).feature1 : 'Projets illimités',
                'feature2' in t.pricing ? (t.pricing as any).feature2 : 'Clients illimités',
                'feature3' in t.pricing ? (t.pricing as any).feature3 : 'Notifications IA',
                'feature4' in t.pricing ? (t.pricing as any).feature4 : 'Analytics avancés',
                'feature5' in t.pricing ? (t.pricing as any).feature5 : 'Support prioritaire',
                'feature6' in t.pricing ? (t.pricing as any).feature6 : 'Stockage illimité',
              ]}
              buttonText={'buttonText' in t.pricing ? (t.pricing as any).buttonText : 'Commencer'}
              onButtonClick={() => setDialogOpen(true)}
              badge={t.pricing.badge}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.cta.title}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t.cta.subtitle}
          </p>
          <ShimmerButton onClick={() => setDialogOpen(true)} className="px-8 py-4 text-lg font-semibold rounded-xl">
            <span className="flex items-center gap-2">
              {t.cta.button}
              <ArrowRight className="h-5 w-5" />
            </span>
          </ShimmerButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Aura PRO</span>
            <span className="text-muted-foreground">© 2024</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="/contact" className="hover:text-foreground transition-colors">Contact</a>
            <a href="#" className="hover:text-foreground transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-foreground transition-colors">Confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
