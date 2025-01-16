const STORAGE_KEY = "bolt-offline-data";

export const offlineStorage = {
  // Sauvegarder les données en local
  saveData(key: string, data: any) {
    try {
      const storage = this.getStorage();
      storage[key] = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données:", error);
    }
  },

  // Récupérer les données du stockage local
  getData(key: string) {
    try {
      const storage = this.getStorage();
      const item = storage[key];
      if (!item) return null;

      // Vérifier si les données sont encore valides (24h)
      const isValid = Date.now() - item.timestamp < 24 * 60 * 60 * 1000;
      return isValid ? item.data : null;
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      return null;
    }
  },

  // Vider le cache
  clearCache() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Erreur lors du nettoyage du cache:", error);
    }
  },

  // Récupérer tout le stockage
  private getStorage(): Record<string, { data: any; timestamp: number }> {
    try {
      const storage = localStorage.getItem(STORAGE_KEY);
      return storage ? JSON.parse(storage) : {};
    } catch (error) {
      console.error("Erreur lors de la lecture du stockage:", error);
      return {};
    }
  },
};
