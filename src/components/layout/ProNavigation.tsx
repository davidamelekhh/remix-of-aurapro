import { Building2, LayoutDashboard, FolderKanban, Users } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/pro/dashboard', icon: LayoutDashboard },
  { name: 'Projets', href: '/pro/projects', icon: FolderKanban },
  { name: 'Clients', href: '/pro/clients', icon: Users },
];

export function ProNavigation() {
  const location = useLocation();

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
              <span className="text-xl font-bold text-foreground">Nexo Pro</span>
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

          {/* User section (placeholder) */}
          <div className="flex items-center">
            <div className="text-sm text-muted-foreground">Mode Promoteur</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
