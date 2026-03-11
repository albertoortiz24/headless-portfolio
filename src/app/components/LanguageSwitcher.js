// app/components/LanguageSwitcher.js - Versión ultra simple
'use client';

import { useRouter } from 'next/navigation';

export default function LanguageSwitcher({ currentLang }) {
  const router = useRouter();

  const switchToSpanish = () => {
    // Forzar navegación a /es
    router.push('/es');
  };

  const switchToEnglish = () => {
    // Forzar navegación a /en
    router.push('/en');
  };

  return (
    <div className="flex gap-4 absolute top-4 right-4 z-50">
      <button
        onClick={switchToSpanish}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          currentLang === 'es' 
            ? 'bg-green-600 text-white' 
            : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        <span className="mr-2">🇲🇽</span>
        Español
      </button>
      <button
        onClick={switchToEnglish}
        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
          currentLang === 'en' 
            ? 'bg-blue-600 text-white' 
            : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-300'
        }`}
      >
        <span className="mr-2">🇺🇸</span>
        English
      </button>
    </div>
  );
}