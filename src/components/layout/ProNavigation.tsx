import { useState } from 'react';
import { Building2, LayoutDashboard, FolderKanban, Users, Menu, X, LogOut, Settings, BarChart3, UserCog } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/pro/dashboard', icon: LayoutDashboard },
  { name: 'Projets', href: '/pro/projects', icon: FolderKanban },
  { name: 'Clients', href: '/pro/clients', icon: Users },
  { name: 'Analytics', href: '/pro/analytics', icon: BarChart3 },
  { name: 'Intervenants', href: '/pro/stakeholders', icon: UserCog },
  { name: 'Paramètres', href: '/pro/settings', icon: Settings },
];

export function ProNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/pro/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-bold text-foreground">Aura Pro</span>
            </Link>

            {/* Navigation */}
            <div className="hidden md:flex md:space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User section */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-sm text-muted-foreground">Mode Promoteur</div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={signOut}
              className="hidden md:flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
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
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
              <Button 
                variant="ghost" 
                onClick={signOut}
                className="w-full justify-start"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Déconnexion
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
