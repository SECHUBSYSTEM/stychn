import { useState, useEffect } from "react";
import type { TileData, Unit, Quality } from "../types";

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export const waitForSvgJs = (): Promise<any> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.SVG) {
      resolve(window.SVG);
      return;
    }

    const checkSvg = setInterval(() => {
      if (typeof window !== "undefined" && window.SVG) {
        clearInterval(checkSvg);
        resolve(window.SVG);
      }
    }, 100);

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkSvg);
      resolve(null);
    }, 10000);
  });
};

export const parseSvgViewBox = (svgString: string): number[] => {
  const match = svgString.match(/viewBox="([\d\.\s-]+)"/);
  if (!match || !match[1]) {
    return [0, 0, 100, 100]; // Default fallback
  }

  const values = match[1].split(/\s+/).map(Number);
  return values.length === 4 ? values : [0, 0, 100, 100];
};

export const generateSvgFromCanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  includeDataUrl: boolean = true
): string => {
  const dataUrl = canvas.toDataURL("image/png", 1.0);

  if (!includeDataUrl) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="white"/>
    </svg>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">
    <image href="${dataUrl}" width="${width}" height="${height}"/>
  </svg>`;
};

export const generateSingleSvg = (
  tiles: TileData[],
  pageWidth: number,
  pageHeight: number,
  tilesX: number,
  tilesY: number,
  _overlapPx: number,
  dpi: number
): string => {
  const totalWidth = tilesX * pageWidth * dpi;
  const totalHeight = tilesY * pageHeight * dpi;

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="${totalHeight}">`;

  for (const tile of tiles) {
    const x = tile.x * pageWidth * dpi;
    const y = tile.y * pageHeight * dpi;
    const dataUrl = tile.canvas.toDataURL("image/png", 1.0);

    svgContent += `<image href="${dataUrl}" x="${x}" y="${y}" width="${
      pageWidth * dpi
    }" height="${pageHeight * dpi}"/>`;
  }

  svgContent += "</svg>";
  return svgContent;
};

// Unit conversion utilities
export const toCm = (value: number, unit: Unit): number => {
  const num = parseFloat(String(value));
  if (isNaN(num)) return 0;

  switch (unit) {
    case "in":
      return num * 2.54;
    case "mm":
      return num / 10;
    case "cm":
    default:
      return num;
  }
};

export const fromCm = (value: number, unit: Unit): number => {
  const num = parseFloat(String(value));
  if (isNaN(num)) return 0;

  switch (unit) {
    case "in":
      return num / 2.54;
    case "mm":
      return num * 10;
    case "cm":
    default:
      return num;
  }
};

// Quality DPI mapping
export const qualityDpiMap: Record<Quality, number> = {
  low: 36,
  standard: 72,
  high: 300,
} as const;
