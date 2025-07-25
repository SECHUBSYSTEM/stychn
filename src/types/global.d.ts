// Global type definitions for external libraries loaded via CDN

declare global {
  interface Window {
    jsPDF: typeof import("jspdf").jsPDF;
    pdfjsLib: typeof import("pdfjs-dist");
    SVG: any; // svg.js doesn't have great TypeScript support
    JSZip: typeof import("jszip");
  }

  // jsPDF global constructor
  const jsPDF: typeof import("jspdf").jsPDF;

  // PDF.js global
  const pdfjsLib: typeof import("pdfjs-dist");

  // JSZip global
  const JSZip: typeof import("jszip");
}

// PDF.js specific types
declare module "pdfjs-dist" {
  interface PDFDocumentProxy {
    numPages: number;
    getPage(pageNumber: number): Promise<PDFPageProxy>;
  }

  interface PDFPageProxy {
    getViewport(params: { scale: number }): PDFPageViewport;
    render(renderContext: PDFRenderContext): PDFRenderTask;
  }

  interface PDFPageViewport {
    width: number;
    height: number;
  }

  interface PDFRenderContext {
    canvasContext: CanvasRenderingContext2D;
    viewport: PDFPageViewport;
  }

  interface PDFRenderTask {
    promise: Promise<void>;
  }

  interface GlobalWorkerOptions {
    workerSrc: string;
  }

  const GlobalWorkerOptions: GlobalWorkerOptions;

  function getDocument(src: { data: ArrayBuffer }): {
    promise: Promise<PDFDocumentProxy>;
  };
}

export {};
