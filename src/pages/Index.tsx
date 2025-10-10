import { Navigation } from '@/components/layout/Navigation';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="mb-6 bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Vous êtes promoteur immobilier ?</h2>
          <p className="text-muted-foreground mb-4">
            Accédez à votre espace pro pour gérer vos projets et vos clients
          </p>
          <Link to="/auth">
            <Button>Accéder à l'espace Pro</Button>
          </Link>
        </div>
        <Dashboard />
      </main>
    </div>
  );
};

export default Index;
