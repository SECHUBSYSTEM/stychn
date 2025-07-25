"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { ChangeEvent } from "react";
import {
  waitForSvgJs,
  useDebounce,
  generateSvgFromCanvas,
  generateSingleSvg,
  parseSvgViewBox,
  toCm,
  fromCm,
  qualityDpiMap,
} from "../lib/utils";
import type {
  Dimensions,
  CustomSize,
  PageSize,
  PageSizes,
  Unit,
  Orientation,
  Quality,
  OutputFormat,
  TileData,
} from "../types";
import { isImageFile, isSvgFile, isPdfFile, isSupportedFile } from "../types";

export default function PatternTiler(): React.JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: "",
    height: "",
  });
  const [pageSize, setPageSize] = useState<PageSize>("A4");
  const [customSize, setCustomSize] = useState<CustomSize>({
    width: "",
    height: "",
  });
  const [bleedMargin, setBleedMargin] = useState<number>(1.5);
  const [notchSize, setNotchSize] = useState<number>(0.5);
  const [orientation, setOrientation] = useState<Orientation>("automatic");
  const [notes, setNotes] = useState<string>(
    'Assembly Guide\nTotal Tiles: [Total Tiles] ([TilesX] x [TilesY])\nInstructions: Print at "Actual size", cut along any outside border which has a notch. Align notches and overlap (if overlap is used) and glue or tape tiles together.'
  );
  const [tiledPreview, setTiledPreview] = useState<TileData[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("pdf");
  const [error, setError] = useState<string>("");
  const [unit, setUnit] = useState<Unit>("cm");
  const [quality, setQuality] = useState<Quality>("standard");
  const [overlapEnabled, setOverlapEnabled] = useState<boolean>(true);
  const previewButtonRef = useRef<HTMLButtonElement>(null);

  const pageSizes: PageSizes = {
    A4: { width: 21, height: 29.7 },
    A3: { width: 29.7, height: 42 },
    Letter: { width: 21.59, height: 27.94 },
    Custom: { width: 0, height: 0 },
  };

  const debouncedDimensions = useDebounce(dimensions, 500);

  const handleFileUpload = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) {
      setError("No file selected.");
      return;
    }

    if (!isSupportedFile(uploadedFile)) {
      setError(
        "Unsupported file type. Please upload SVG, PDF, PNG, or JPG files."
      );
      return;
    }

    setFile(uploadedFile);
    setError("");
    console.log("File uploaded:", uploadedFile.type);

    try {
      if (isPdfFile(uploadedFile)) {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        if (numPages < 1) {
          throw new Error("PDF has no pages");
        }
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Could not get canvas context");
        }

        const maxHeight = 256;
        const scale = Math.min(maxHeight / viewport.height, 1);
        canvas.height = viewport.height * scale;
        canvas.width = viewport.width * scale;
        const renderContext = {
          canvasContext: context,
          viewport: page.getViewport({ scale: scale }),
        };
        await page.render(renderContext).promise;
        setPreviewUrl(canvas.toDataURL("image/png"));
      } else if (isSvgFile(uploadedFile)) {
        const text = await uploadedFile.text();
        const viewBox = parseSvgViewBox(text);
        if (viewBox && viewBox.length === 4) {
          const [, , width, height] = viewBox.map(Number);
          if (width && height && width > 0 && height > 0) {
            setPreviewUrl(URL.createObjectURL(uploadedFile));
          } else {
            setError("Invalid SVG: viewBox dimensions are invalid or missing.");
            return;
          }
        } else {
          setError("Invalid SVG: unable to parse viewBox.");
          return;
        }
      } else if (isImageFile(uploadedFile)) {
        const img = new Image();
        img.src = URL.createObjectURL(uploadedFile);
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Failed to load image"));
        });
        setPreviewUrl(URL.createObjectURL(uploadedFile));
      }
    } catch (err) {
      console.error("File upload error:", err);
      setError(
        "Error processing file: " +
          (err instanceof Error ? err.message : String(err))
      );
    }
  };

  const generateTiledPattern = useCallback(async (): Promise<void> => {
    const widthCm = toCm(parseFloat(debouncedDimensions.width), unit);
    const heightCm = toCm(parseFloat(debouncedDimensions.height), unit);
    const bleedMarginCm = toCm(parseFloat(String(bleedMargin)), unit);
    const notchSizeCm = toCm(parseFloat(String(notchSize)), unit);
    const overlapCm = overlapEnabled ? 1.0 : 0.0;

    if (widthCm <= 0 || heightCm <= 0 || bleedMarginCm < 0 || notchSizeCm < 0) {
      setError(
        "Negative values are not allowed for dimensions, bleed margin, or notch size."
      );
      setTiledPreview([]);
      return;
    }

    if (!file && (debouncedDimensions.width || debouncedDimensions.height)) {
      setError("Upload pattern before entering dimensions.");
      setTiledPreview([]);
      return;
    }

    if (
      !file ||
      !debouncedDimensions.width ||
      !debouncedDimensions.height ||
      isNaN(widthCm) ||
      isNaN(heightCm)
    ) {
      setError(
        "Invalid file or dimensions. Please enter valid width and height."
      );
      setTiledPreview([]);
      return;
    }

    let pageWidth: number;
    let pageHeight: number;

    if (pageSize === "Custom") {
      pageWidth = toCm(parseFloat(customSize.width), unit);
      pageHeight = toCm(parseFloat(customSize.height), unit);
    } else {
      const page = pageSizes[pageSize];
      pageWidth = page.width;
      pageHeight = page.height;
    }

    if (
      !pageWidth ||
      !pageHeight ||
      isNaN(pageWidth) ||
      isNaN(pageHeight) ||
      pageWidth <= 0 ||
      pageHeight <= 0
    ) {
      setError("Invalid page size.");
      setTiledPreview([]);
      return;
    }

    if (isNaN(bleedMarginCm) || bleedMarginCm < 0) {
      setError("Invalid bleed margin.");
      setTiledPreview([]);
      return;
    }

    if (orientation === "automatic") {
      const portraitPages =
        Math.ceil(widthCm / (pageWidth - 2 * bleedMarginCm - overlapCm)) *
        Math.ceil(heightCm / (pageHeight - 2 * bleedMarginCm - overlapCm));
      const landscapePages =
        Math.ceil(widthCm / (pageHeight - 2 * bleedMarginCm - overlapCm)) *
        Math.ceil(heightCm / (pageWidth - 2 * bleedMarginCm - overlapCm));
      if (landscapePages < portraitPages) {
        [pageWidth, pageHeight] = [pageHeight, pageWidth];
      }
    } else if (orientation === "landscape") {
      [pageWidth, pageHeight] = [pageHeight, pageWidth];
    }

    const tileWidth = pageWidth - 2 * bleedMarginCm - overlapCm;
    const tileHeight = pageHeight - 2 * bleedMarginCm - overlapCm;
    const tilesX = Math.ceil(widthCm / tileWidth);
    const tilesY = Math.ceil(heightCm / tileHeight);
    const tiles: TileData[] = [];

    for (let y = 0; y < tilesY; y++) {
      for (let x = 0; x < tilesX; x++) {
        const canvas = document.createElement("canvas");
        const dpi = qualityDpiMap[quality];
        canvas.width = pageWidth * dpi;
        canvas.height = pageHeight * dpi;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError("Could not get canvas context");
          continue;
        }

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const borderMargin = bleedMarginCm * dpi;
        const contentWidth = canvas.width - 2 * borderMargin;
        const contentHeight = canvas.height - 2 * borderMargin;
        const overlapPx = overlapCm * dpi;

        ctx.save();
        ctx.beginPath();
        ctx.rect(borderMargin, borderMargin, contentWidth, contentHeight);
        ctx.clip();

        const offsetX = x * tileWidth * dpi;
        const offsetY = y * tileHeight * dpi;
        const drawX = -offsetX + borderMargin;
        const drawY = -offsetY + borderMargin;

        try {
          if (isSvgFile(file)) {
            const text = await file.text();
            const img = new Image();
            img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
              text
            )}`;
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = () => reject(new Error("Failed to load SVG"));
            });
            ctx.drawImage(img, drawX, drawY, widthCm * dpi, heightCm * dpi);
          } else if (isPdfFile(file)) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer })
              .promise;
            const numPages = pdf.numPages;
            if (numPages < 1) {
              throw new Error("PDF has no pages");
            }
            const page = await pdf.getPage(1);
            const viewport = page.getViewport({ scale: dpi / 72 });
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = Math.ceil(viewport.width);
            tempCanvas.height = Math.ceil(viewport.height);
            const tempCtx = tempCanvas.getContext("2d");
            if (!tempCtx) {
              throw new Error("Could not get temp canvas context");
            }
            const renderContext = { canvasContext: tempCtx, viewport };
            await page.render(renderContext).promise;
            ctx.drawImage(
              tempCanvas,
              drawX,
              drawY,
              widthCm * dpi,
              heightCm * dpi
            );
          } else if (isImageFile(file) && previewUrl) {
            const img = new Image();
            img.src = previewUrl;
            await new Promise<void>((resolve, reject) => {
              img.onload = () => resolve();
              img.onerror = () => reject(new Error("Failed to load image"));
            });
            ctx.drawImage(img, drawX, drawY, widthCm * dpi, heightCm * dpi);
          }
        } catch (err) {
          console.error(`Tile rendering error at ${y + 1}-${x + 1}:`, err);
          setError(
            `Rendering error at tile ${y + 1}-${x + 1}: ${
              err instanceof Error ? err.message : String(err)
            }`
          );
          continue;
        }

        ctx.restore();

        if (overlapEnabled) {
          ctx.strokeStyle = "#ff0000";
          ctx.lineWidth = 1.5;
          ctx.setLineDash([2, 2, 10, 2]);
          ctx.fillStyle = "#000";
          ctx.font = "12px Arial";

          if (x > 0) {
            const prevTile = tiles.find((t) => t.x === x - 1 && t.y === y);
            if (prevTile) {
              const prevCtx = prevTile.canvas.getContext("2d");
              if (prevCtx) {
                const overlapImage = prevCtx.getImageData(
                  prevTile.canvas.width - overlapPx - borderMargin,
                  borderMargin,
                  overlapPx,
                  contentHeight
                );
                ctx.clearRect(
                  borderMargin,
                  borderMargin,
                  overlapPx,
                  contentHeight
                );
                ctx.putImageData(overlapImage, borderMargin, borderMargin);
              }
            }
            ctx.beginPath();
            ctx.moveTo(borderMargin + overlapPx, borderMargin);
            ctx.lineTo(borderMargin + overlapPx, borderMargin + contentHeight);
            ctx.stroke();
            ctx.save();
            ctx.translate(borderMargin + overlapPx + 10, canvas.height / 2);
            ctx.rotate(-Math.PI / 2);
            ctx.fillText("Overlap", 0, 0);
            ctx.restore();
          }

          if (y > 0) {
            const prevTile = tiles.find((t) => t.x === x && t.y === y - 1);
            if (prevTile) {
              const prevCtx = prevTile.canvas.getContext("2d");
              if (prevCtx) {
                const overlapImage = prevCtx.getImageData(
                  borderMargin,
                  prevTile.canvas.height - overlapPx - borderMargin,
                  contentWidth,
                  overlapPx
                );
                ctx.clearRect(
                  borderMargin,
                  borderMargin,
                  contentWidth,
                  overlapPx
                );
                ctx.putImageData(overlapImage, borderMargin, borderMargin);
              }
            }
            ctx.beginPath();
            ctx.moveTo(borderMargin, borderMargin + overlapPx);
            ctx.lineTo(borderMargin + contentWidth, borderMargin + overlapPx);
            ctx.stroke();
            ctx.fillText(
              "Overlap",
              canvas.width / 2 - 20,
              borderMargin + overlapPx + 15
            );
          }

          ctx.setLineDash([]);
        }

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.strokeRect(borderMargin, borderMargin, contentWidth, contentHeight);

        const notchPx = toCm(parseFloat(String(notchSize)), unit) * dpi;
        ctx.fillStyle = "#000";
        if (x > 0)
          ctx.fillRect(
            borderMargin - notchPx / 2,
            canvas.height / 2 - notchPx / 2,
            notchPx,
            notchPx
          );
        if (x < tilesX - 1)
          ctx.fillRect(
            canvas.width - borderMargin - notchPx / 2,
            canvas.height / 2 - notchPx / 2,
            notchPx,
            notchPx
          );
        if (y > 0)
          ctx.fillRect(
            canvas.width / 2 - notchPx / 2,
            borderMargin - notchPx / 2,
            notchPx,
            notchPx
          );
        if (y < tilesY - 1)
          ctx.fillRect(
            canvas.width / 2 - notchPx / 2,
            canvas.height - borderMargin - notchPx / 2,
            notchPx,
            notchPx
          );

        ctx.font = "36px Arial";
        ctx.fillStyle = "#000";
        ctx.globalAlpha = 0.5;
        ctx.fillText(
          `Tile ${y + 1}-${x + 1}`,
          borderMargin + 10,
          borderMargin + 40
        );
        ctx.globalAlpha = 1.0;

        tiles.push({ canvas, x, y });
      }
    }
    setTiledPreview(tiles);
    setError("");
  }, [
    file,
    debouncedDimensions,
    pageSize,
    customSize,
    bleedMargin,
    notchSize,
    orientation,
    unit,
    previewUrl,
    quality,
    overlapEnabled,
  ]);

  useEffect(() => {
    if (
      debouncedDimensions.width &&
      debouncedDimensions.height &&
      !isNaN(Number(debouncedDimensions.width)) &&
      !isNaN(Number(debouncedDimensions.height))
    ) {
      generateTiledPattern().catch((err) => {
        console.error("Generation error:", err);
        setError(
          "Failed to generate tiles: " +
            (err instanceof Error ? err.message : String(err))
        );
      });
    }
  }, [
    debouncedDimensions,
    bleedMargin,
    notchSize,
    generateTiledPattern,
    overlapEnabled,
  ]);

  const downloadPattern = async (): Promise<void> => {
    if (tiledPreview.length === 0) {
      setError("No tiles to download.");
      return;
    }

    let pageWidth: number;
    let pageHeight: number;

    if (pageSize === "Custom") {
      pageWidth = toCm(parseFloat(customSize.width), unit);
      pageHeight = toCm(parseFloat(customSize.height), unit);
    } else {
      const page = pageSizes[pageSize];
      pageWidth = page.width;
      pageHeight = page.height;
    }

    let finalOrientation = orientation;
    const overlapCm = overlapEnabled ? 1.0 : 0.0;

    if (orientation === "automatic") {
      const widthCm = toCm(Number(debouncedDimensions.width), unit);
      const heightCm = toCm(Number(debouncedDimensions.height), unit);
      const bleedMarginCm = toCm(bleedMargin, unit);
      const portraitPages =
        Math.ceil(widthCm / (pageWidth - 2 * bleedMarginCm - overlapCm)) *
        Math.ceil(heightCm / (pageHeight - 2 * bleedMarginCm - overlapCm));
      const landscapePages =
        Math.ceil(widthCm / (pageHeight - 2 * bleedMarginCm - overlapCm)) *
        Math.ceil(heightCm / (pageWidth - 2 * bleedMarginCm - overlapCm));
      if (landscapePages < portraitPages) {
        [pageWidth, pageHeight] = [pageHeight, pageWidth];
        finalOrientation = "landscape";
      } else {
        finalOrientation = "portrait";
      }
    } else if (orientation === "landscape") {
      [pageWidth, pageHeight] = [pageHeight, pageWidth];
    }

    const tilesX = Math.max(...tiledPreview.map((t) => t.x + 1));
    const tilesY = Math.max(...tiledPreview.map((t) => t.y + 1));
    const overlapPx = overlapCm;

    try {
      if (outputFormat === "pdf") {
        const doc = new jsPDF({
          orientation: finalOrientation as "portrait" | "landscape",
          unit: "cm",
          format: pageSize === "Custom" ? [pageWidth, pageHeight] : pageSize,
          compress: true,
        });

        for (const tile of tiledPreview) {
          const highResCanvas = document.createElement("canvas");
          const dpi = qualityDpiMap[quality];
          highResCanvas.width = pageWidth * dpi;
          highResCanvas.height = pageHeight * dpi;
          const ctx = highResCanvas.getContext("2d");
          if (!ctx) {
            throw new Error("Could not get canvas context");
          }
          ctx.drawImage(
            tile.canvas,
            0,
            0,
            highResCanvas.width,
            highResCanvas.height
          );

          if (tiledPreview.indexOf(tile) > 0) doc.addPage();
          const imgData = highResCanvas.toDataURL("image/png", 1.0);
          doc.addImage(
            imgData,
            "PNG",
            0,
            0,
            pageWidth,
            pageHeight,
            undefined,
            "MEDIUM"
          );
        }

        doc.addPage();
        doc.setFontSize(10);
        const guideText =
          `Assembly Guide\nTotal Tiles: ${tiledPreview.length} (${tilesX} x ${tilesY})\n` +
          Array.from({ length: tilesY }, (_, y) =>
            Array.from(
              { length: tilesX },
              (_, x) => `Tile ${y + 1}-${x + 1}`
            ).join("  ")
          ).join("\n") +
          "\n" +
          notes
            .replace("[Total Tiles]", String(tiledPreview.length))
            .replace("[TilesX]", String(tilesX))
            .replace("[TilesY]", String(tilesY));
        const lines = doc.splitTextToSize(guideText, pageWidth - 2);
        doc.text(lines, 1, 1, { maxWidth: pageWidth - 2 });

        const link = document.createElement("a");
        const blob = doc.output("blob");
        link.href = URL.createObjectURL(blob);
        link.download = "tiled_pattern.pdf";
        link.click();
        URL.revokeObjectURL(link.href);
      } else if (outputFormat === "svg") {
        const zip = new JSZip();
        const SVG = await waitForSvgJs();

        for (const tile of tiledPreview) {
          const svgContent = SVG
            ? SVG()
                .size(
                  pageWidth * qualityDpiMap[quality],
                  pageHeight * qualityDpiMap[quality]
                )
                .image(
                  tile.canvas.toDataURL("image/png", 1.0),
                  0,
                  0,
                  pageWidth * qualityDpiMap[quality],
                  pageHeight * qualityDpiMap[quality]
                )
                .svg()
            : generateSvgFromCanvas(
                tile.canvas,
                pageWidth * qualityDpiMap[quality],
                pageHeight * qualityDpiMap[quality],
                false
              );
          zip.file(`tile_${tile.y + 1}-${tile.x + 1}.svg`, svgContent);
        }

        const guide = notes
          .replace("[Total Tiles]", String(tiledPreview.length))
          .replace("[TilesX]", String(tilesX))
          .replace("[TilesY]", String(tilesY));
        zip.file("assembly_guide.txt", guide);

        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "tiled_pattern.zip";
        link.click();
        URL.revokeObjectURL(link.href);
      } else if (outputFormat === "svg_single") {
        const svgContent = generateSingleSvg(
          tiledPreview,
          pageWidth,
          pageHeight,
          tilesX,
          tilesY,
          overlapPx,
          qualityDpiMap[quality]
        );
        const guide = notes
          .replace("[Total Tiles]", String(tiledPreview.length))
          .replace("[TilesX]", String(tilesX))
          .replace("[TilesY]", String(tilesY));

        const zip = new JSZip();
        zip.file("tiled_pattern.svg", svgContent);
        zip.file("assembly_guide.txt", guide);
        const content = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "tiled_pattern_single_svg.zip";
        link.click();
        URL.revokeObjectURL(link.href);
      }
    } catch (err) {
      console.error("Download error:", err);
      setError(
        "Failed to download pattern: " +
          (err instanceof Error ? err.message : String(err))
      );
    }
  };

  useEffect(() => {
    if (previewButtonRef.current) {
      previewButtonRef.current.focus();
    }
  }, []);

  const handleUnitChange = (newUnit: Unit): void => {
    setDimensions({
      width: debouncedDimensions.width
        ? String(fromCm(toCm(Number(debouncedDimensions.width), unit), newUnit))
        : "",
      height: debouncedDimensions.height
        ? String(
            fromCm(toCm(Number(debouncedDimensions.height), unit), newUnit)
          )
        : "",
    });
    setCustomSize({
      width: customSize.width
        ? String(fromCm(toCm(Number(customSize.width), unit), newUnit))
        : "",
      height: customSize.height
        ? String(fromCm(toCm(Number(customSize.height), unit), newUnit))
        : "",
    });
    setBleedMargin(fromCm(toCm(bleedMargin, unit), newUnit));
    setNotchSize(fromCm(toCm(notchSize, unit), newUnit));
    setUnit(newUnit);
  };

  return (
    <div className="container mx-auto p-4" role="main">
      <h1 className="text-2xl font-bold mb-2" aria-label="Stycha Pattern Tiler">
        Stycha Pattern Tiler
      </h1>
      <p className="text-gray-600 mb-4" aria-label="Description">
        Convert large sewing and craft patterns into printable tiles.
      </p>
      {error && (
        <p className="text-red-500 mb-4" role="alert">
          {error}
        </p>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-medium">Unit of Measurement</h3>
        <select
          value={unit}
          onChange={(e) => handleUnitChange(e.target.value as Unit)}
          className="border p-2"
          aria-label="Select unit of measurement">
          <option value="mm">Millimeters (mm)</option>
          <option value="cm">Centimeters (cm)</option>
          <option value="in">Inches (in)</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2
            className="text-xl font-semibold mb-2"
            aria-label="Upload Pattern">
            Upload Pattern
          </h2>
          <input
            type="file"
            accept=".svg,.pdf,.png,.jpg"
            onChange={handleFileUpload}
            className="mb-2"
            aria-label="Upload pattern file"
          />
          <p
            className="text-sm text-gray-600 mb-4"
            aria-label="Supported file types">
            Supported files: SVG, PDF, PNG, JPG.
          </p>
          {previewUrl && (
            <div className="mb-4">
              <h3 className="text-lg font-medium">Pattern Preview</h3>
              <img
                src={previewUrl}
                alt="Pattern Preview"
                className="max-w-full h-auto max-h-64"
              />
            </div>
          )}
          <div className="mb-4">
            <h3 className="text-lg font-medium">Pattern Dimensions ({unit})</h3>
            <p className="text-sm text-gray-600 mb-1">
              Enter precise dimensions of artboard and print at "Actual Size" to
              avoid scaling issues.
            </p>
            <input
              type="number"
              step="0.1"
              placeholder="Width"
              value={debouncedDimensions.width}
              onChange={(e) =>
                setDimensions({ ...debouncedDimensions, width: e.target.value })
              }
              className="border p-2 mr-2 w-24"
              aria-label="Pattern width"
            />
            <input
              type="number"
              step="0.1"
              placeholder="Height"
              value={debouncedDimensions.height}
              onChange={(e) =>
                setDimensions({
                  ...debouncedDimensions,
                  height: e.target.value,
                })
              }
              className="border p-2 w-24"
              aria-label="Pattern height"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Output Page Size</h3>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value as PageSize)}
              className="border p-2"
              aria-label="Select page size">
              {Object.keys(pageSizes).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {pageSize === "Custom" && (
              <div className="mt-2">
                <input
                  type="number"
                  step="0.1"
                  placeholder={`Width (${unit})`}
                  value={customSize.width}
                  onChange={(e) =>
                    setCustomSize({ ...customSize, width: e.target.value })
                  }
                  className="border p-2 mr-2 w-24"
                  aria-label="Custom width"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder={`Height (${unit})`}
                  value={customSize.height}
                  onChange={(e) =>
                    setCustomSize({ ...customSize, height: e.target.value })
                  }
                  className="border p-2 w-24"
                  aria-label="Custom height"
                />
              </div>
            )}
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Bleed Margin ({unit})</h3>
            <input
              type="number"
              step="0.1"
              value={bleedMargin}
              onChange={(e) => setBleedMargin(Number(e.target.value))}
              className="border p-2 w-24"
              aria-label="Bleed margin"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Notch Size ({unit})</h3>
            <input
              type="number"
              step="0.1"
              value={notchSize}
              onChange={(e) => setNotchSize(Number(e.target.value))}
              className="border p-2 w-24"
              aria-label="Notch size"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Paper Orientation</h3>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as Orientation)}
              className="border p-2"
              aria-label="Select orientation">
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
              <option value="automatic">Automatic</option>
            </select>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Quality</h3>
            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value as Quality)}
              className="border p-2"
              aria-label="Select quality">
              <option value="low">Low (36dpi)</option>
              <option value="standard">Standard (72dpi)</option>
              <option value="high">High (300dpi)</option>
            </select>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">1cm Overlap</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={overlapEnabled}
                onChange={(e) => setOverlapEnabled(e.target.checked)}
                className="mr-2"
                aria-label="Toggle 1cm overlap"
              />
              Enable Overlap
            </label>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Additional Notes</h3>
            <p className="text-sm text-gray-600 mb-1">
              Extra information may be added such as additional sewing
              instructions or fabric type.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border p-2 w-full"
              rows={4}
              aria-label="Additional notes"
            />
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Output Format</h3>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
              className="border p-2"
              aria-label="Select output format">
              <option value="pdf">PDF</option>
              <option value="svg">SVG (Individual Files)</option>
              <option value="svg_single">SVG (Single File)</option>
            </select>
          </div>
          <button
            ref={previewButtonRef}
            onClick={downloadPattern}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 mr-2"
            disabled={tiledPreview.length === 0}
            aria-label="Download tiled pattern">
            Download Tiled Pattern
          </button>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2" aria-label="Tiled Preview">
            Tiled Preview
          </h2>
          {tiledPreview.length === 0 ? (
            <p className="text-gray-600">
              No tiles generated. Upload a file and set dimensions to see the
              preview.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {tiledPreview.map((tile, index) => (
                <div key={index} className="border p-2">
                  <img
                    src={tile.canvas.toDataURL("image/jpeg", 0.7)}
                    alt={`Tile ${tile.y + 1}-${tile.x + 1}`}
                    className="max-w-full h-auto"
                  />
                  <p className="text-center">
                    Tile {tile.y + 1}-{tile.x + 1}
                  </p>
                </div>
              ))}
            </div>
          )}
          {tiledPreview.length > 0 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Assembly Guide</h2>
              <p className="text-gray-600 mb-2">
                Total Tiles: {tiledPreview.length} (
                {Math.max(...tiledPreview.map((t) => t.x + 1))} x{" "}
                {Math.max(...tiledPreview.map((t) => t.y + 1))})
              </p>
              <div className="border p-2">
                {Array.from(
                  { length: Math.max(...tiledPreview.map((t) => t.y + 1)) },
                  (_, y) => (
                    <div key={y} className="flex">
                      {Array.from(
                        {
                          length: Math.max(...tiledPreview.map((t) => t.x + 1)),
                        },
                        (_, x) => (
                          <div key={x} className="border p-1 text-center w-16">
                            Tile {y + 1}-{x + 1}
                          </div>
                        )
                      )}
                    </div>
                  )
                )}
              </div>
              <p className="text-gray-600 mt-2">
                Instructions: Print at "Actual size", cut along solid borders.
                If the pattern tiles have overlap, align overlap sections (the
                red lines marked 'Overlap') using notches and tape or glue them
                together. If pattern tiles do not have overlap, align pages
                using notches and tape them together.
              </p>
              {notes &&
                notes.trim() !==
                  'Assembly Guide\nTotal Tiles: [Total Tiles] ([TilesX] x [TilesY])\nInstructions: Print at "Actual size", cut along any outside border which has a notch. Align notches and overlap (if overlap is used) and glue or tape tiles together.' && (
                  <p className="text-gray-600 mt-2">
                    <strong>Notes:</strong>{" "}
                    {notes
                      .replace(
                        'Assembly Guide\nTotal Tiles: [Total Tiles] ([TilesX] x [TilesY])\nInstructions: Print at "Actual size", cut along any outside border which has a notch. Align notches and overlap (if overlap is used) and glue or tape tiles together.',
                        ""
                      )
                      .trim()}
                  </p>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
