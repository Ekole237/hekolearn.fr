interface PerformanceMetric {
  timestamp: number;
  duration: number;
  success: boolean;
}

interface CacheMetrics {
  hits: number;
  misses: number;
  totalRequests: number;
  averageAccessTime: number;
  hitRate: number;
  metrics: PerformanceMetric[];
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  private readonly MAX_METRICS = 100;

  // Enregistrer une métrique
  record(operation: string, duration: number, success: boolean): void {
    const metric: PerformanceMetric = {
      timestamp: Date.now(),
      duration,
      success,
    };

    const operationMetrics = this.metrics.get(operation) || [];
    operationMetrics.push(metric);

    // Garder seulement les dernières métriques
    if (operationMetrics.length > this.MAX_METRICS) {
      operationMetrics.shift();
    }

    this.metrics.set(operation, operationMetrics);
  }

  // Obtenir les métriques pour une opération
  getMetrics(operation: string): CacheMetrics {
    const metrics = this.metrics.get(operation) || [];
    const successfulOps = metrics.filter(m => m.success);
    
    const totalRequests = metrics.length;
    const hits = successfulOps.length;
    const misses = totalRequests - hits;
    
    const averageAccessTime = metrics.length > 0
      ? metrics.reduce((acc, m) => acc + m.duration, 0) / metrics.length
      : 0;

    return {
      hits,
      misses,
      totalRequests,
      averageAccessTime,
      hitRate: totalRequests > 0 ? hits / totalRequests : 0,
      metrics,
    };
  }

  // Obtenir les métriques de performance globales
  getAllMetrics(): Record<string, CacheMetrics> {
    const allMetrics: Record<string, CacheMetrics> = {};
    
    for (const [operation, metrics] of this.metrics.entries()) {
      allMetrics[operation] = this.getMetrics(operation);
    }

    return allMetrics;
  }

  // Réinitialiser les métriques
  reset(operation?: string): void {
    if (operation) {
      this.metrics.delete(operation);
    } else {
      this.metrics.clear();
    }
  }

  // Obtenir un résumé des performances
  getSummary(): string {
    const summary = [];
    for (const [operation, metrics] of Object.entries(this.getAllMetrics())) {
      summary.push(
        `${operation}:`,
        `  - Taux de succès: ${(metrics.hitRate * 100).toFixed(2)}%`,
        `  - Temps moyen: ${metrics.averageAccessTime.toFixed(2)}ms`,
        `  - Total requêtes: ${metrics.totalRequests}`,
        ""
      );
    }
    return summary.join("\n");
  }
}

export const performanceMonitor = new PerformanceMonitor();
