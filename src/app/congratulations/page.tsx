"use client";

import { useState } from "react";
import CongratulationsModal from "@/components/CongratulationsModal";

export default function CongratulationsPage(): React.JSX.Element {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-muted-beige flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-warm-brown mb-8">
          Congratulations Modal Demo
        </h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Click the button below to see the congratulations modal with the medal
          icon and discount offer.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="bg-warm-brown text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-colors shadow-lg">
          Show Congratulations Modal
        </button>
      </div>

      <CongratulationsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
