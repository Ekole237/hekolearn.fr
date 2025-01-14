import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { performanceMonitor } from '@/lib/performance-metrics';

const REFRESH_INTERVAL = 4 * 60 * 1000; // 4 minutes
const BROADCAST_CHANNEL = 'auth-channel';

export class SessionManager {
  private static instance: SessionManager;
  private refreshInterval: NodeJS.Timeout | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private supabase = createClientComponentClient<Database>();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupRefreshInterval();
      this.setupBroadcastChannel();
    }
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private setupRefreshInterval() {
    // Nettoyer l'intervalle existant si présent
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    // Créer un nouvel intervalle pour le rafraîchissement de la session
    this.refreshInterval = setInterval(async () => {
      const start = performance.now();
      try {
        const { data: { session }, error } = await this.supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          // Vérifier si le token doit être rafraîchi (moins de 60 secondes avant expiration)
          const expiresAt = session.expires_at * 1000; // Convertir en millisecondes
          const now = Date.now();
          const timeUntilExpiry = expiresAt - now;

          if (timeUntilExpiry < 60000) { // 60 secondes
            const { data: { session: newSession }, error: refreshError } = 
              await this.supabase.auth.refreshSession();

            if (refreshError) throw refreshError;

            // Notifier les autres onglets du rafraîchissement
            if (newSession && this.broadcastChannel) {
              this.broadcastChannel.postMessage({
                type: 'SESSION_REFRESHED',
                session: newSession,
              });
            }
          }
        }

        const duration = performance.now() - start;
        performanceMonitor.record('session-refresh', duration, !error);
      } catch (error) {
        console.error('Error refreshing session:', error);
        performanceMonitor.record('session-refresh', performance.now() - start, false);
      }
    }, REFRESH_INTERVAL);
  }

  private setupBroadcastChannel() {
    if (typeof window === 'undefined') return;

    try {
      this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL);
      this.broadcastChannel.onmessage = this.onmessage.bind(this);
    } catch (error) {
      console.error('Error setting up broadcast channel:', error);
    }
  }

  private async onmessage(event: MessageEvent) {
    const { type, session } = event.data;

    switch (type) {
      case 'SESSION_REFRESHED':
        // Mettre à jour la session locale si nécessaire
        if (session) {
          await this.supabase.auth.setSession(session);
        }
        break;

      case 'SIGN_OUT':
        // Se déconnecter dans tous les onglets
        await this.signOut();
        break;

      default:
        break;
    }
  }

  async signOut() {
    const start = performance.now();
    try {
      // Nettoyer l'intervalle de rafraîchissement
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }

      // Notifier les autres onglets
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ type: 'SIGN_OUT' });
      }

      // Se déconnecter localement
      await this.supabase.auth.signOut();

      const duration = performance.now() - start;
      performanceMonitor.record('session-signout', duration, true);
    } catch (error) {
      console.error('Error during sign out:', error);
      performanceMonitor.record('session-signout', performance.now() - start, false);
      throw error;
    }
  }

  cleanup() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }

    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
  }
}
