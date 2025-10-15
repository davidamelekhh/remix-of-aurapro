import { useState } from 'react';
import { LayoutDashboard, FolderKanban, Users, Menu, X, LogOut, Settings, BarChart3, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import aiAssistant from '@/assets/ai-assistant-pro.png';
import auraProLogo from '@/assets/aura-pro-logo.png';

const navigation = [
  { name: 'Dashboard', href: '/pro/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/pro/clients', icon: Users },
  { name: 'Projets', href: '/pro/projects', icon: FolderKanban },
  { name: 'Analytics', href: '/pro/analytics', icon: BarChart3 },
  { name: 'Paramètres', href: '/pro/settings', icon: Settings },
];

// Page summary data based on current route
const getPageSummary = (pathname: string) => {
  if (pathname.includes('/dashboard')) {
    return {
      title: 'Dashboard',
      insights: [
        { label: 'Projets actifs', value: '12' },
        { label: 'Complétion moyenne', value: '73%' },
        { label: 'Clients satisfaits', value: '98%' },
      ],
      quote: 'Vos projets progressent bien. Aucun retard majeur détecté.',
    };
  }
  if (pathname.includes('/analytics')) {
    return {
      title: 'Analytics',
      insights: [
        { label: 'CA estimé', value: '2.4M€' },
        { label: 'ROI moyen', value: '+24%' },
        { label: 'Croissance', value: '+18%' },
      ],
      quote: 'Performance exceptionnelle ce trimestre.',
    };
  }
  if (pathname.includes('/projects')) {
    return {
      title: 'Projets',
      insights: [
        { label: 'En cours', value: '8' },
        { label: 'Terminés', value: '24' },
        { label: 'Pipeline', value: '5' },
      ],
      quote: 'Pipeline solide pour les prochains mois.',
    };
  }
  if (pathname.includes('/clients')) {
    return {
      title: 'Clients',
      insights: [
        { label: 'Total clients', value: '47' },
        { label: 'Nouveaux ce mois', value: '3' },
        { label: 'Taux satisfaction', value: '96%' },
      ],
      quote: 'Relations clients excellentes.',
    };
  }
  return {
    title: 'Aura Pro',
    insights: [
      { label: 'Vue globale', value: '—' },
      { label: 'Statut', value: 'OK' },
      { label: 'Alertes', value: '0' },
    ],
    quote: 'Tout fonctionne parfaitement.',
  };
};

export function ProNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();
  const pageSummary = getPageSummary(location.pathname);

  return (
    <>
      {/* Desktop Header */}
      <div className="hidden lg:block bg-background border-b border-border/20">
        <div className="max-w-[1800px] mx-auto px-12 py-4">
          <div className="grid grid-cols-[280px_1fr_320px] gap-8 items-stretch">
            {/* Left Navigation */}
            <div className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl p-4 shadow-lg flex flex-col">
              <nav className="h-full flex flex-col">
                {/* Logo */}
                <div className="flex flex-col pb-2 mb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <img 
                      src={auraProLogo} 
                      alt="Aura Pro" 
                      className="h-7 w-auto"
                    />
                    <span className="text-lg font-bold text-foreground">Aura Pro</span>
                  </div>
                  <div className="w-full h-px bg-border/30" />
                </div>

                {/* Navigation Links */}
                <div className="space-y-0.5 flex-1">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300',
                          isActive
                            ? 'bg-foreground text-background shadow-lg'
                            : 'text-foreground/70 hover:text-foreground hover:bg-secondary/50'
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </div>

            {/* Center AI Rectangle */}
            <div className="flex items-start justify-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative"
              >
                <div className="w-full max-w-[700px] rounded-2xl bg-gradient-to-br from-foreground/5 to-foreground/10 border border-border/30 shadow-2xl overflow-hidden backdrop-blur-sm">
                  {/* AI Assistant Image */}
                  <img 
                    src={aiAssistant} 
                    alt="AI Assistant" 
                    className="w-full h-auto object-cover"
                  />
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/5 to-transparent opacity-50" />
                </div>
              </motion.div>
            </div>

            {/* Right Summary Box */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl p-4 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                    Page Summary
                  </h3>
                </div>

                <div className="space-y-3">
                  {/* Key metrics */}
                  <div className="space-y-3">
                    {pageSummary.insights.map((insight, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-foreground/60">{insight.label}</span>
                        <span className="text-lg font-bold text-foreground">{insight.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Quote at bottom */}
              <div className="pt-4 border-t border-border/20 mt-auto">
                <p className="text-sm text-foreground/70 italic leading-relaxed">
                  "{pageSummary.quote}"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </>
  );
}
