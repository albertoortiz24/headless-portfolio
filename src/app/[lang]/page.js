// app/[lang]/page.js
import LanguageSwitcher from '../components/LanguageSwitcher';
import Card from '../components/Card';
import { translations } from '../../lib/translations';

export default async function HomePage({ params }) {
  // ✅ IMPORTANTE: Ahora debemos esperar (await) por params
  const { lang } = await params;
  
  // El resto del código igual
  const t = translations[lang] || translations.es;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <LanguageSwitcher currentLang={lang} />
      
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-5xl font-bold text-center mb-16 text-gray-800">
          {t.welcome}
        </h1>

        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          <Card
            title={t.recruiter}
            description={t.recruiterDesc}
            buttonText={t.enter}
            targetPath="recruiter"
            lang={lang}
          />
          <Card
            title={t.client}
            description={t.clientDesc}
            buttonText={t.enter}
            targetPath="client"
            lang={lang}
          />
        </div>
      </div>
    </main>
  );
}