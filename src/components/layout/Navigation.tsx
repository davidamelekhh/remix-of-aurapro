import { useState } from 'react';
import { Home, Building2, MessageSquare, FileText, Settings, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Tableau de bord', nameAr: 'لوحة القيادة', href: '/', icon: Home },
  { name: 'Projets', nameAr: 'المشاريع', href: '/projects', icon: Building2 },
  { name: 'Messages', nameAr: 'الرسائل', href: '/messages', icon: MessageSquare },
  { name: 'Documents', nameAr: 'الوثائق', href: '/documents', icon: FileText },
  { name: 'Paramètres', nameAr: 'الإعدادات', href: '/settings', icon: Settings },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'ar'>('fr');
  const location = useLocation();

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-luxury rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">ImoTrack</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'text-muted-foreground hover:text-primary hover:bg-secondary'
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {language === 'fr' ? item.name : item.nameAr}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'fr' ? 'ar' : 'fr')}
              className="text-xs font-medium"
            >
              {language === 'fr' ? 'العربية' : 'Français'}
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border mt-2 pt-2 pb-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'text-muted-foreground hover:text-primary hover:bg-secondary'
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {language === 'fr' ? item.name : item.nameAr}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}