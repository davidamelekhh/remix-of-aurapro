import { useState, useEffect } from 'react';
import { getUserRole, getCurrentUser } from '@/lib/api/auth';

// ============================================
// USER ROLE HOOK
// TODO: Replace mock implementation with your backend
// This hook provides the current user's role (pro/client)
// ============================================

export function useUserRole() {
  const [role, setRole] = useState<'pro' | 'client' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // TODO: Replace with your authentication check
        const user = await getCurrentUser();
        if (!user) {
          setRole(null);
          setLoading(false);
          return;
        }

        // TODO: Fetch role from your backend
        const userRole = await getUserRole(user.id);
        setRole(userRole);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  return { role, loading };
}
