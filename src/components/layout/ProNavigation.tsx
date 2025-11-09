import { LayoutDashboard, FolderKanban, Users, Settings, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import auraProLogo from '@/assets/aura-pro-logo.png';

const navigation = [
  { name: 'Dashboard', href: '/pro/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/pro/clients', icon: Users },
  { name: 'Projets', href: '/pro/projects', icon: FolderKanban },
  { name: 'Analytics', href: '/pro/analytics', icon: BarChart3 },
  { name: 'Paramètres', href: '/pro/settings', icon: Settings },
];


export function ProNavigation() {
  const location = useLocation();

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between gap-8">
          {/* Left Navigation Items */}
          <nav className="flex items-center gap-6 flex-1 justify-end">
            {navigation.slice(0, 2).map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Center Logo */}
          <div className="flex flex-col items-center gap-2">
            <img 
              src={auraProLogo} 
              alt="Aura Pro" 
              className="h-12 w-auto"
            />
            <span className="text-lg font-bold text-foreground">Aura Pro</span>
          </div>

          {/* Right Navigation Items */}
          <nav className="flex items-center gap-6 flex-1">
            {navigation.slice(2).map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
