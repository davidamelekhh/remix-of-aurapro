import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, BarChart3, Bell, FolderOpen, Users, Shield, Clock, TrendingUp, MessageSquare, ChevronDown, Instagram } from 'lucide-react';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('fr');
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [contactType, setContactType] = useState<'email' | 'phone'>('email');
  const [selectedCurrency, setSelectedCurrency] = useState<'EUR' | 'USD' | 'CAD' | 'MAD'>('EUR');
  const [dialogOpen, setDialogOpen] = useState(false);
  const languages = {
    fr: {
      flag: '🇫🇷',
      name: 'Français'
    },
    en: {
      flag: '🇬🇧',
      name: 'English'
    },
    ar: {
      flag: '🇲🇦',
      name: 'العربية'
    }
  };
  
  const currencies = {
    EUR: { symbol: '€', rate: 1, name: 'EUR' },
    USD: { symbol: '$', rate: 1.1, name: 'USD' },
    CAD: { symbol: 'C$', rate: 1.5, name: 'CAD' },
    MAD: { symbol: 'DH', rate: 11, name: 'MAD' }
  };
  
  const getPriceInCurrency = (basePrice: number) => {
    const converted = Math.round(basePrice * currencies[selectedCurrency].rate);
    return `${converted}${currencies[selectedCurrency].symbol}`;
  };
  
  const waitlistSchema = z.object({
    email: z.string().trim().email({ message: "Adresse email invalide" }).max(255, { message: "Email trop long" })
  });

  const handleWaitlistSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Validate input
      const validated = waitlistSchema.parse({
        email: waitlistEmail
      });

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

  return <div className="min-h-screen bg-background text-foreground">
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
            
            {languageMenuOpen && <div className="absolute top-full right-0 mt-2 bg-card border-2 border-border rounded-xl shadow-lg overflow-hidden z-50 min-w-[160px]">
                {Object.entries(languages).map(([code, lang]) => <button key={code} type="button" onClick={() => {
              setSelectedLanguage(code as Language);
              setLanguageMenuOpen(false);
            }} className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 bg-card">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </button>)}
              </div>}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <motion.div initial={{
          opacity: 0,
          scale: 0.8
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: 0.1,
          duration: 0.6
        }} className="mb-12 flex justify-center">
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
                <button type="button" onClick={() => setContactType('email')} className={`px-3 py-1.5 text-xs rounded transition-all ${contactType === 'email' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  {t.hero.email}
                </button>
                <button type="button" onClick={() => setContactType('phone')} className={`px-3 py-1.5 text-xs rounded transition-all ${contactType === 'phone' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                  {t.hero.phone}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Language Selector - Desktop only */}
              <div className="relative hidden md:block">
                <button type="button" onClick={() => setLanguageMenuOpen(!languageMenuOpen)} className="h-[56px] w-[56px] rounded-xl border-2 bg-background hover:bg-secondary transition-all flex items-center justify-center text-2xl">
                  {languages[selectedLanguage].flag}
                </button>
                
                {languageMenuOpen && <div className="absolute top-full mt-2 bg-card border-2 border-border rounded-xl shadow-lg overflow-hidden z-50 min-w-[160px]">
                    {Object.entries(languages).map(([code, lang]) => <button key={code} type="button" onClick={() => {
                  setSelectedLanguage(code as Language);
                  setLanguageMenuOpen(false);
                }} className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center gap-3 bg-card">
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.name}</span>
                      </button>)}
                  </div>}
              </div>

              <div className="flex-1 relative">
                {/* Email/Tél selector - Desktop only, inside input */}
                <div className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 gap-1 bg-muted/50 backdrop-blur-sm rounded-lg p-1">
                  <button type="button" onClick={() => setContactType('email')} className={`px-2 py-1 text-xs rounded transition-all ${contactType === 'email' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                    {t.hero.email}
                  </button>
                  <button type="button" onClick={() => setContactType('phone')} className={`px-2 py-1 text-xs rounded transition-all ${contactType === 'phone' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                    {t.hero.phone}
                  </button>
                </div>
                <Input type={contactType === 'email' ? 'email' : 'tel'} placeholder={contactType === 'email' ? t.hero.emailPlaceholder : t.hero.phonePlaceholder} value={waitlistEmail} onChange={e => setWaitlistEmail(e.target.value)} required className="w-full pl-4 sm:pl-28 pr-4 py-4 sm:py-6 text-base sm:text-lg rounded-xl border-2 focus:border-primary transition-all text-center sm:text-left" />
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
            {[t.questions.q1, t.questions.q2, t.questions.q3, t.questions.q4, t.questions.q5, t.questions.q6, t.questions.q7].map((question, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20,
            filter: "blur(10px)"
          }} whileInView={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)"
          }} transition={{
            duration: 0.8,
            delay: index * 0.5,
            ease: [0.16, 1, 0.3, 1]
          }} viewport={{
            once: true,
            margin: "-100px"
          }} className="text-2xl md:text-3xl font-light text-background/80 text-center">
                {question}
              </motion.div>)}
          </div>

          <motion.div initial={{
          opacity: 0,
          scale: 0.95
        }} whileInView={{
          opacity: 1,
          scale: 1
        }} transition={{
          duration: 0.8,
          delay: 3.5,
          ease: [0.16, 1, 0.3, 1]
        }} viewport={{
          once: true
        }} className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-background">
              {t.questions.answer} <span className="font-medium">{t.questions.answerAccent}</span>
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
                {t.solution.title} <span className="font-medium">{t.solution.titleAccent}</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {t.solution.description1}
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.solution.description2}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  {t.solution.feature1}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  {t.solution.feature2}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  {t.solution.feature3}
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  {t.solution.feature4}
                </div>
              </div>
              <div className="pt-2">
                <ShimmerButton onClick={() => window.scrollTo({
                top: 0,
                behavior: 'smooth'
              })} className="px-6 py-3 text-base font-semibold rounded-xl">
                  <span className="flex items-center gap-2">
                    {t.solution.cta}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </ShimmerButton>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl border border-border shadow-float overflow-hidden">
                <img src={solutionDashboard} alt={t.solution.imageAlt} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            {t.features.title} <span className="font-medium">{t.features.titleAccent}</span>
          </h2>
          <p className="text-xl text-muted-foreground text-center mb-16">
            {t.features.subtitle}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-3xl p-8 border border-border space-y-4 hover:shadow-float transition-all duration-300">
              <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
                <FolderOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{t.features.feature1Title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.features.feature1Desc}
              </p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border space-y-4 hover:shadow-float transition-all duration-300">
              <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{t.features.feature2Title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.features.feature2Desc}
              </p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border space-y-4 hover:shadow-float transition-all duration-300">
              <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{t.features.feature3Title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.features.feature3Desc}
              </p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border space-y-4 hover:shadow-float transition-all duration-300">
              <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{t.features.feature4Title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.features.feature4Desc}
              </p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border space-y-4 hover:shadow-float transition-all duration-300">
              <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{t.features.feature5Title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.features.feature5Desc}
              </p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border space-y-4 hover:shadow-float transition-all duration-300">
              <div className="h-12 w-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{t.features.feature6Title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.features.feature6Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            {t.results.title} <span className="font-medium">{t.results.titleAccent}</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-card rounded-3xl p-8 border border-border text-center space-y-2">
              <div className="text-5xl font-bold">+60%</div>
              <p className="text-muted-foreground">{t.results.result1}</p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border text-center space-y-2">
              <div className="text-5xl font-bold">0</div>
              <p className="text-muted-foreground">{t.results.result2}</p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border text-center space-y-2">
              <div className="text-5xl font-bold">100%</div>
              <p className="text-muted-foreground">{t.results.result3}</p>
            </div>
            <div className="bg-card rounded-3xl p-8 border border-border text-center space-y-2">
              <div className="text-5xl font-bold">2x</div>
              <p className="text-muted-foreground">{t.results.result4}</p>
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
              {t.pricing.title} <span className="font-medium">{t.pricing.titleAccent}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t.pricing.subtitle}
            </p>
            
            {/* Currency Selector */}
            <div className="flex justify-center pt-4">
              <div className="flex gap-2 bg-card border-2 border-border rounded-xl p-1">
                {Object.entries(currencies).map(([code, currency]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedCurrency(code as 'EUR' | 'USD' | 'CAD' | 'MAD')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      selectedCurrency === code
                        ? 'bg-foreground text-background shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {currency.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SinglePricingCard badge={t.pricing.badge} title={t.pricing.cardTitle} subtitle={t.pricing.cardSubtitle} price={`${t.pricing.pricePrefix} ${getPriceInCurrency(299)}${t.pricing.priceSuffix}`} benefits={[{
          icon: 'check',
          text: t.pricing.benefit1
        }, {
          icon: 'shield',
          text: t.pricing.benefit2
        }, {
          icon: 'heart',
          text: t.pricing.benefit3
        }]} priceNote={t.pricing.priceNote} features={[{
          text: 'Tableau de bord temps réel avec analytics avancés'
        }, {
          text: 'Gestion complète des projets et des équipes'
        }, {
          text: 'Suivi financier détaillé et rapports automatiques'
        }, {
          text: 'Communication client intégrée et portail dédié'
        }, {
          text: 'Espace documentaire sécurisé avec versioning'
        }, {
          text: 'Notifications intelligentes et alertes personnalisées'
        }, {
          text: 'Calendrier de projet et gestion des échéances'
        }, {
          text: 'Gestion des paiements et factures automatisées'
        }, {
          text: 'Création de site internet dernière génération automatique pour vos projets'
        }, {
          text: 'Application mobile iOS et Android'
        }, {
          text: 'Intégrations avec vos outils favoris'
        }, {
          text: 'Mises à jour régulières et nouvelles fonctionnalités'
        }, {
          text: 'Formation et onboarding personnalisé'
        }, {
          text: 'Bénéficier d\'une réduction de 50% sur les 3 premiers mois'
        }]} primaryButton={{
          text: t.pricing.ctaButton,
          onClick: () => window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        }} />
        </div>
      </section>

      {/* Early Adopters Banner */}
      <section className="relative min-h-[500px] md:h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img src={earlyAdoptersBanner} alt="Early Adopters Recognition" className="w-full h-full object-cover object-center" />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 md:bg-gradient-to-r md:from-black/70 md:via-black/50 md:to-transparent"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-0 flex items-center">
          <div className="max-w-2xl space-y-4 md:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {t.earlyAdopters.title} <span className="font-medium">{t.earlyAdopters.titleAccent}</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 leading-relaxed">
              {t.earlyAdopters.description}
            </p>
            <div className="pt-2">
              <ShimmerButton onClick={() => window.scrollTo({
              top: 0,
              behavior: 'smooth'
            })} className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold rounded-xl">
                <span className="flex items-center gap-2">
                  {t.earlyAdopters.cta}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </ShimmerButton>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 px-6 bg-secondary/30">
        <div className="container z-10 mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.8,
          delay: 0.1,
          ease: [0.16, 1, 0.3, 1]
        }} viewport={{
          once: true
        }} className="flex flex-col items-center justify-center max-w-[540px] mx-auto">
            <div className="flex justify-center">
              <div className="border py-1 px-4 rounded-lg text-sm">{t.testimonials.badge}</div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-5 text-center">
              {t.testimonials.title} <span className="font-medium">{t.testimonials.titleAccent}</span>
            </h2>
            <p className="text-center mt-5 text-muted-foreground text-lg">
              {t.testimonials.subtitle}
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              {t.faq.title} <span className="font-medium">{t.faq.titleAccent}</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              {t.faq.subtitle}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-float transition-all duration-300">
              <h3 className="text-lg font-semibold mb-2">{t.faq.q1Title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.faq.q1Answer}
              </p>
            </div>
            
            <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-float transition-all duration-300">
              <h3 className="text-lg font-semibold mb-2">{t.faq.q2Title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.faq.q2Answer}
              </p>
            </div>
            
            <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-float transition-all duration-300">
              <h3 className="text-lg font-semibold mb-2">{t.faq.q3Title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.faq.q3Answer}
              </p>
            </div>
            
            <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-float transition-all duration-300">
              <h3 className="text-lg font-semibold mb-2">{t.faq.q4Title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.faq.q4Answer}
              </p>
            </div>
            
            <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-float transition-all duration-300">
              <h3 className="text-lg font-semibold mb-2">Quel support proposez-vous ?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Nous offrons un support premium 7j/7 par email, chat et téléphone. Notre équipe est là pour vous accompagner à chaque étape et répondre à toutes vos questions rapidement.
              </p>
            </div>
            
            <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-float transition-all duration-300">
              <h3 className="text-lg font-semibold mb-2">Comment fonctionne la réduction de 50% sur les 3 premiers mois ?</h3>
              <p className="text-muted-foreground leading-relaxed">
                En vous inscrivant maintenant pour 299€, vous bénéficiez automatiquement d'une réduction de 50% sur vos 3 premiers mois d'abonnement une fois l'application lancée. C'est notre façon de remercier nos early adopters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-foreground text-background">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold leading-tight">
            Prêt à passer à la nouvelle ère
            <br />
            <span className="font-medium">de la gestion immobilière ?</span>
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
          {/* Dashboard Laptop Image */}
          <div className="mt-12 relative">
            <img src={dashboardLaptop} alt="Aura PRO Dashboard" className="w-full max-w-5xl mx-auto rounded-lg" />
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-32 px-6 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Nos derniers <span className="font-medium">articles</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Conseils et actualités pour les professionnels de l'immobilier
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Article 1 */}
            <div 
              onClick={() => navigate('/article/rentabilite')}
              className="bg-card rounded-3xl border border-border overflow-hidden hover:shadow-float transition-all duration-300 group cursor-pointer"
            >
              <div className="aspect-video overflow-hidden">
                <img src={articleAnalytics} alt="Analytics immobilier" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>5 min de lecture</span>
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  Comment améliorer la rentabilité de vos projets immobiliers
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Découvrez les meilleures pratiques pour optimiser vos marges et réduire les coûts imprévus dans vos projets de construction.
                </p>
                <div className="flex items-center gap-2 text-primary font-medium">
                  Lire l'article
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Article 2 */}
            <div 
              onClick={() => navigate('/article/tendances-2025')}
              className="bg-card rounded-3xl border border-border overflow-hidden hover:shadow-float transition-all duration-300 group cursor-pointer"
            >
              <div className="aspect-video overflow-hidden">
                <img src={articleConstruction} alt="Construction immobilière" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>7 min de lecture</span>
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  Les tendances de la promotion immobilière en 2025
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Analyse des nouvelles attentes des clients et des évolutions technologiques qui transforment le secteur.
                </p>
                <div className="flex items-center gap-2 text-primary font-medium">
                  Lire l'article
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Article 3 */}
            <div 
              onClick={() => navigate('/article/digitalisation')}
              className="bg-card rounded-3xl border border-border overflow-hidden hover:shadow-float transition-all duration-300 group cursor-pointer"
            >
              <div className="aspect-video overflow-hidden">
                <img src={articleDigital} alt="Transformation digitale" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>6 min de lecture</span>
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                  Digitalisation : comment transformer votre gestion de projet
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Guide pratique pour passer d'une gestion traditionnelle à une approche digitale moderne et efficace.
                </p>
                <div className="flex items-center gap-2 text-primary font-medium">
                  Lire l'article
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
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
              <div className="flex items-center gap-2">
                <a href="#" className="hover:text-foreground transition-colors">Contact</a>
                <a href="https://www.instagram.com/aura.pro.ai?igsh=MXF1ZHRncDB1eWthZQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Aura PRO. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>

    </div>;
}