"use client";

export function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-lg transition-all"
      aria-label="Powrót"
    >
      ←
    </button>
  );
}
