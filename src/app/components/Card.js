'use client';

import { useRouter } from 'next/navigation';

export default function Card({ title, description, buttonText, targetPath, lang }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full hover:shadow-xl transition-shadow">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">{title}</h2>
      <p className="text-gray-600 mb-8 text-lg">{description}</p>
      <button
        onClick={() => router.push(`/${lang}/${targetPath}`)}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg text-xl transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}