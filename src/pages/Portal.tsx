import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, ArrowRight, Sparkles, Hexagon } from 'lucide-react';

export default function Portal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-6">
            {/* Logo + Brand */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="relative">
                <Hexagon className="h-12 w-12 text-primary fill-primary/10" strokeWidth={2.5} />
                <Sparkles className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Aura PRO
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              Votre plateforme de gestion immobilière intelligente
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Espace Promoteur */}
            <Link to="/auth/promoteur" className="group">
              <div className="relative h-full bg-card rounded-3xl border border-border overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:scale-[1.02] hover:border-primary/20">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex p-4 rounded-2xl bg-primary text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <Building2 className="h-8 w-8" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <h2 className="text-2xl font-bold text-foreground">
                      Espace Promoteur
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Créez et gérez vos projets immobiliers, suivez vos équipes et vos clients en temps réel
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-4 transition-all duration-300 mt-6">
                    <span>Accéder à l'espace</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Espace Client */}
            <Link to="/auth/client" className="group">
              <div className="relative h-full bg-card rounded-3xl border border-border overflow-hidden transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:scale-[1.02] hover:border-primary/20">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="inline-flex p-4 rounded-2xl bg-accent text-accent-foreground shadow-lg group-hover:scale-110 transition-transform duration-500">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <h2 className="text-2xl font-bold text-foreground">
                      Espace Client
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Consultez l'avancement de vos projets, vos documents et communiquez avec votre promoteur
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-4 transition-all duration-300 mt-6">
                    <span>Accéder à mon espace</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
