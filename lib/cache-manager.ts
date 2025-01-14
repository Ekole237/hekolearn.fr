import { compress, decompress } from "lz-string";

const CACHE_PREFIX = "bolt-cache";
const CACHE_VERSION = "v1";
const MAX_CACHE_AGE = 24 * 60 * 60 * 1000; // 24 heures
const MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50 MB

interface CacheEntry {
  data: any;
  timestamp: number;
  size: number;
}

interface CacheMetadata {
  totalSize: number;
  lastCleanup: number;
}

class CacheManager {
  private getCacheKey(key: string): string {
    return `${CACHE_PREFIX}-${CACHE_VERSION}-${key}`;
  }

  private getMetadataKey(): string {
    return `${CACHE_PREFIX}-${CACHE_VERSION}-metadata`;
  }

  private getMetadata(): CacheMetadata {
    try {
      const data = localStorage.getItem(this.getMetadataKey());
      return data
        ? JSON.parse(data)
        : { totalSize: 0, lastCleanup: Date.now() };
    } catch (error) {
      console.error("Erreur lors de la lecture des métadonnées:", error);
      return { totalSize: 0, lastCleanup: Date.now() };
    }
  }

  private setMetadata(metadata: CacheMetadata): void {
    try {
      localStorage.setItem(
        this.getMetadataKey(),
        JSON.stringify(metadata)
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des métadonnées:", error);
    }
  }

  private checkCacheSize(): void {
    const metadata = this.getMetadata();
    
    if (metadata.totalSize > MAX_CACHE_SIZE || 
        Date.now() - metadata.lastCleanup > MAX_CACHE_AGE) {
      this.cleanupOldEntries();
    }
  }

  private cleanupOldEntries(): void {
    try {
      const keys = Object.keys(localStorage)
        .filter(key => key.startsWith(`${CACHE_PREFIX}-${CACHE_VERSION}`))
        .filter(key => key !== this.getMetadataKey());

      // Trier les entrées par date
      const entries = keys
        .map(key => {
          const entry = localStorage.getItem(key);
          if (!entry) return null;
          const { timestamp }: CacheEntry = JSON.parse(entry);
          return { key, timestamp };
        })
        .filter((entry): entry is { key: string; timestamp: number } => entry !== null)
        .sort((a, b) => a.timestamp - b.timestamp);

      // Supprimer les entrées les plus anciennes
      for (const entry of entries) {
        const key = entry.key.replace(`${CACHE_PREFIX}-${CACHE_VERSION}-`, "");
        this.delete(key);
        
        const metadata = this.getMetadata();
        if (metadata.totalSize < MAX_CACHE_SIZE * 0.8) break;
      }

      // Mettre à jour la date du dernier nettoyage
      const metadata = this.getMetadata();
      metadata.lastCleanup = Date.now();
      this.setMetadata(metadata);
    } catch (error) {
      console.error("Erreur lors du nettoyage du cache:", error);
    }
  }

  set(key: string, data: any): void {
    try {
      const compressedData = compress(JSON.stringify(data));
      const entry: CacheEntry = {
        data: compressedData,
        timestamp: Date.now(),
        size: compressedData.length,
      };

      // Vérifier et nettoyer le cache si nécessaire
      this.checkCacheSize();

      // Mettre à jour les métadonnées
      const metadata = this.getMetadata();
      metadata.totalSize += entry.size;
      this.setMetadata(metadata);

      // Sauvegarder les données
      localStorage.setItem(
        this.getCacheKey(key),
        JSON.stringify(entry)
      );
    } catch (error) {
      console.error("Erreur lors de la mise en cache:", error);
    }
  }

  get(key: string): any {
    try {
      const entry = localStorage.getItem(this.getCacheKey(key));
      if (!entry) return null;

      const { data, timestamp, size }: CacheEntry = JSON.parse(entry);

      // Vérifier si les données sont expirées
      if (Date.now() - timestamp > MAX_CACHE_AGE) {
        this.delete(key);
        return null;
      }

      // Décompresser et retourner les données
      return JSON.parse(decompress(data));
    } catch (error) {
      console.error("Erreur lors de la lecture du cache:", error);
      return null;
    }
  }

  delete(key: string): void {
    try {
      const entry = localStorage.getItem(this.getCacheKey(key));
      if (entry) {
        const { size }: CacheEntry = JSON.parse(entry);
        localStorage.removeItem(this.getCacheKey(key));

        // Mettre à jour les métadonnées
        const metadata = this.getMetadata();
        metadata.totalSize -= size;
        this.setMetadata(metadata);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du cache:", error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith(`${CACHE_PREFIX}-${CACHE_VERSION}`)) {
          localStorage.removeItem(key);
        }
      }
      this.setMetadata({ totalSize: 0, lastCleanup: Date.now() });
    } catch (error) {
      console.error("Erreur lors du nettoyage du cache:", error);
    }
  }
}

export const cacheManager = new CacheManager();
