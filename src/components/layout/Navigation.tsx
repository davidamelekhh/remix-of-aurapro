import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navigation() {
  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-bold text-foreground">Nexo</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}