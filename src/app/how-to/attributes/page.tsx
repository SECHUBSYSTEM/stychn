"use client";

import Image from "next/image";

export default function AttributesPage() {
  const attributes = [
    {
      title: "Supported Files",
      desc: "Upload your designs in SVG, PDF, PNG, or JPG formats.",
    },
    {
      title: "Output Options",
      desc: "elect from PDF or SVG downloads to meet your project needs.",
    },
    {
      title: "Seamless Tiling",
      desc: "Pattern tiling accounts for bleed margins and automatically adds notches, ensuring a perfect fit when assembled.",
    },
    {
      title: "Auto Organisation",
      desc: "Tiles are automatically numbered and include assembly instructions for a smooth workflow.",
    },
    {
      title: "Customisable Settings",
      desc: "Adjust tile size, bleed margin, notch size, and orientation. Let the tool automatically choose the orientation that minimises tile count for your selected paper size.",
    },
    {
      title: "Page Overlap",
      desc: "Choose whether to overlap adjoining tile pieces for easier assembly, or turn off overlap to generate fewer tiles - either way, there will be zero pattern loss to bleed margins and precise alignment.",
    },
  ];
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-warm-brown mb-6 md:mb-8">
        Attributes
      </h1>
      <ol className="relative space-y-4 md:space-y-6 pl-6 md:pl-8">
        {/* Tracer line */}
        <div className="absolute left-[34px] md:left-12 top-3 md:top-0 bottom-12 w-0.5 bg-[#E5E7EB] z-0" />
        {attributes.map((attr, i) => (
          <li key={i} className="flex items-start gap-3 md:gap-4 relative z-10">
            <span className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-[#E5E7EB] text-sm md:text-lg font-bold text-warm-brown relative z-10 flex-shrink-0">
              {i + 1}
            </span>
            <div>
              <div className="font-semibold text-gray-900 text-sm md:text-base">
                {attr.title}
              </div>
              <div className="text-gray-700 text-xs md:text-sm">
                {attr.desc}
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-8 md:mt-12 flex justify-center">
        <div className="w-full max-w-2xl aspect-video rounded-2xl overflow-hidden bg-[#D3C7B0] flex items-center justify-center relative">
          <Image
            src="/video-preview.png"
            alt="Video Preview"
            fill
            className="object-cover"
          />
          <button className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-lg">
            <svg
              width="24"
              height="24"
              className="md:w-9 md:h-9"
              fill="none"
              viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="18" fill="#fff" />
              <polygon points="14,11 26,18 14,25" fill="#8B5529" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
