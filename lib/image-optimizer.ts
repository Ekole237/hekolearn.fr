import { cacheManager } from "./cache-manager";

interface ImageOptimizationOptions {
  maxWidth?: number;
  quality?: number;
  format?: "webp" | "jpeg";
}

interface OptimizedImage {
  dataUrl: string;
  format: string;
  size: number;
}

class ImageOptimizer {
  private canvas: HTMLCanvasElement | null = null;

  private getCanvas(): HTMLCanvasElement {
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
    }
    return this.canvas;
  }

  private async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth?: number
  ): { width: number; height: number } {
    if (!maxWidth || originalWidth <= maxWidth) {
      return { width: originalWidth, height: originalHeight };
    }

    const ratio = maxWidth / originalWidth;
    return {
      width: maxWidth,
      height: Math.round(originalHeight * ratio),
    };
  }

  async optimize(
    src: string,
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImage | null> {
    try {
      const cacheKey = `optimized-image-${src}-${JSON.stringify(options)}`;
      const cached = cacheManager.get(cacheKey);
      if (cached) return cached;

      const {
        maxWidth = 1200,
        quality = 0.8,
        format = "webp",
      } = options;

      const img = await this.loadImage(src);
      const canvas = this.getCanvas();
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;

      const { width, height } = this.calculateDimensions(
        img.width,
        img.height,
        maxWidth
      );

      canvas.width = width;
      canvas.height = height;

      // Appliquer un léger flou pour réduire le bruit
      ctx.filter = "blur(0.5px)";
      ctx.drawImage(img, 0, 0, width, height);
      ctx.filter = "none";

      // Optimiser l'image
      const dataUrl = canvas.toDataURL(`image/${format}`, quality);
      const result: OptimizedImage = {
        dataUrl,
        format,
        size: Math.round(dataUrl.length * 0.75), // Approximation de la taille en octets
      };

      // Mettre en cache le résultat
      cacheManager.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error("Erreur lors de l'optimisation de l'image:", error);
      return null;
    }
  }

  // Précharger et optimiser une image
  async preloadAndOptimize(src: string, options?: ImageOptimizationOptions): Promise<void> {
    try {
      const cacheKey = `optimized-image-${src}-${JSON.stringify(options)}`;
      if (!cacheManager.get(cacheKey)) {
        await this.optimize(src, options);
      }
    } catch (error) {
      console.error("Erreur lors du préchargement de l'image:", error);
    }
  }

  // Nettoyer les ressources
  dispose(): void {
    if (this.canvas) {
      this.canvas.width = 0;
      this.canvas.height = 0;
      this.canvas = null;
    }
  }
}

export const imageOptimizer = new ImageOptimizer();
