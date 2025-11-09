import { LayoutDashboard, FolderKanban, Users, Settings, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const navigation = [
  { name: 'Dashboard', href: '/pro/dashboard', icon: LayoutDashboard },
  { name: 'Clients', href: '/pro/clients', icon: Users },
  { name: 'Projets', href: '/pro/projects', icon: FolderKanban },
  { name: 'Analytics', href: '/pro/analytics', icon: BarChart3 },
  { name: 'Paramètres', href: '/pro/settings', icon: Settings },
];


export function ProNavigation() {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Mobile Bottom Navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile Top Header */}
        <header className="bg-background border-b border-border sticky top-0 z-50">
          <div className="px-4 py-4">
            <span className="text-xl font-bold text-foreground">Aura Pro</span>
          </div>
        </header>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
          <div className="grid grid-cols-5 h-16">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center gap-1 transition-all',
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <item.icon className={cn(
                    'h-5 w-5',
                    isActive && 'fill-current'
                  )} />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </>
    );
  }

  // Desktop Navigation
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
          <div className="flex items-center">
            <span className="text-3xl font-bold text-foreground">Aura Pro</span>
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
