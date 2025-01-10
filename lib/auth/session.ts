import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export class SessionManager {
  private static instance: SessionManager;
  private refreshInterval: NodeJS.Timeout | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private supabase = createClientComponentClient();

  private constructor() {
    if (typeof window !== 'undefined') {
      this.setupRefreshInterval();
      this.setupBroadcastChannel();
    }
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private setupRefreshInterval() {
    // Refresh toutes les 30 minutes
    this.refreshInterval = setInterval(async () => {
      try {
        const { error } = await this.supabase.auth.refreshSession();
        if (error) throw error;
      } catch (error) {
        console.error('Failed to refresh session:', error);
      }
    }, 30 * 60 * 1000);
  }

  private setupBroadcastChannel() {
    if ('BroadcastChannel' in window) {
      this.broadcastChannel = new BroadcastChannel('auth_channel');
      
      this.broadcastChannel.onmessage = (event) => {
        if (event.data === 'SIGNED_OUT') {
          window.location.href = '/auth/login';
        }
      };
    }
  }

  public async signOut() {
    try {
      await this.supabase.auth.signOut();
      this.broadcastChannel?.postMessage('SIGNED_OUT');
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  }

  public cleanup() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.broadcastChannel?.close();
  }
}
