"use client";

import Image from "next/image";

export default function EasyStepsPage() {
  const steps = [
    {
      title: "Design Your Pattern Using Your Favourite Software",
      desc: "Begin by creating your complete pattern layout on a single artboard using any vector or design software you prefer, such as Adobe Illustrator or CorelDRAW.",
    },
    {
      title: "Upload Your Pattern",
      desc: "Upload your finished pattern file directly into the Stychn tiling tool. This is where the magic starts; turning your single artboard design into printable, tile-ready pages.",
    },
    {
      title: "Set Preferences",
      desc: "Tell Stychn the dimensions of your full-size pattern, choose bleed, margin, notch size, page overlap, and paper size (such as A4 or letter).",
    },
    {
      title: "Instant Preview",
      desc: "Stychn generates a tiled preview which responds to the preferences you set, leaving out the guesswork.",
    },
    {
      title: "Delivers Tiled PDFs",
      desc: "Download a print-ready PDF with sub-numbered tiles that. Precise tiling means your customers get cut-and-tape patterns with zero pattern loss in the bleed margins.",
    },
    {
      title: "Includes Instructions",
      desc: "Get adaptable, personalised assembly guides for your customers.",
    },
  ];
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold text-warm-brown mb-6 md:mb-8">
        Easy Steps
      </h1>
      <ol className="relative space-y-4 md:space-y-6 pl-6 md:pl-8">
        {/* Tracer line */}
        <div className="absolute left-[34px] md:left-12 top-3 md:top-4 bottom-3 md:bottom-4 w-0.5 bg-[#E5E7EB] z-0" />
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-3 md:gap-4 relative z-10">
            <span className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-[#E5E7EB] text-sm md:text-lg font-bold text-warm-brown relative z-10 flex-shrink-0">
              {i + 1}
            </span>
            <div>
              <div className="font-semibold text-gray-900 text-sm md:text-base">
                {step.title}
              </div>
              <div className="text-gray-700 text-xs md:text-sm">
                {step.desc}
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
