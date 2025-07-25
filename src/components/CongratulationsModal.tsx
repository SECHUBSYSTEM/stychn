"use client";

import Image from "next/image";

interface CongratulationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  discountCode?: string;
}

export default function CongratulationsModal({
  isOpen,
  onClose,
}: CongratulationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 font-plus-jakarta-sans">
      <div className="bg-[#F9FAFB] rounded-3xl overflow-hidden max-w-sm w-full shadow-xl">
        {/* Upper section with medal */}
        <div className="h-[17rem] flex items-center justify-center relative pt-16 pb-8 px-4">
          {/* Medal icon */}
          <Image
            src="/image.png"
            alt="Medal"
            width={400}
            height={400}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Lower section with text and button */}
        <div className="pt-12 px-8 pb-3 font-bold text-center">
          <h2 className="text-2xl font-bold text-black mb-3 font-plus-jakarta-sans">
            Congratulations!
          </h2>
          <p className="text-xs text-black font-semibold mb-4 leading-relaxed font-plus-jakarta-sans">
            You just unlocked 10% discount code as a thank you for joining our
            newsletter!
          </p>

          <button
            onClick={onClose}
            className="bg-warm-brown text-white px-6 py-2 rounded-full font-normal hover:bg-opacity-90 transition-colors font-plus-jakarta-sans">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
