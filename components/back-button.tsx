"use client";

import { ArrowLeft } from "lucide-react";

export function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="fixed bottom-6 right-6 bg-gray-800 hover:bg-gray-600 text-white rounded-full p-2 shadow-lg transition-all"
      aria-label="Powrót"
    >
      <ArrowLeft className="w-6 h-6 " />
    </button>
  );
}
