// Core application types

export interface Dimensions {
  width: string;
  height: string;
}

export interface CustomSize {
  width: string;
  height: string;
}

export interface PageSizeInfo {
  width: number;
  height: number;
}

export interface PageSizes {
  A4: PageSizeInfo;
  A3: PageSizeInfo;
  Letter: PageSizeInfo;
  Custom: PageSizeInfo;
}

export type PageSize = keyof PageSizes;

export type Unit = "mm" | "cm" | "in";

export type Orientation = "portrait" | "landscape" | "automatic";

export type Quality = "low" | "standard" | "high";

export type OutputFormat = "pdf" | "svg" | "svg_single";

export interface QualityDpiMap {
  low: number;
  standard: number;
  high: number;
}

export interface TileData {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
}

export interface TileGenerationParams {
  file: File;
  dimensions: Dimensions;
  pageSize: PageSize;
  customSize: CustomSize;
  bleedMargin: number;
  notchSize: number;
  orientation: Orientation;
  unit: Unit;
  quality: Quality;
  overlapEnabled: boolean;
}

export interface ConversionUtils {
  toCm: (value: number, unit: Unit) => number;
  fromCm: (value: number, unit: Unit) => number;
}

// File type guards
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/") && file.type !== "image/svg+xml";
};

export const isSvgFile = (file: File): boolean => {
  return file.type === "image/svg+xml";
};

export const isPdfFile = (file: File): boolean => {
  return file.type === "application/pdf";
};

export const isSupportedFile = (file: File): boolean => {
  return isImageFile(file) || isSvgFile(file) || isPdfFile(file);
};
