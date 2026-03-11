import Link from 'next/link';

export default function RecruiterPage({ params }) {
  const { lang } = params;
  
  return (
    <main className="min-h-screen p-8">
      <Link href={`/${lang}`} className="text-blue-600 hover:underline mb-4 block">
        ← Volver
      </Link>
      <h1 className="text-3xl font-bold">
        {lang === 'es' ? 'Perfil para Reclutadores' : 'Recruiter Profile'}
      </h1>
      <p className="mt-4">
        {lang === 'es' 
          ? 'Aquí irá mi experiencia profesional...' 
          : 'Hola reclutador! Aquí podrás conocer mi experiencia profesional, habilidades y proyectos destacados. Estoy emocionado de compartir mi trayectoria contigo y mostrar cómo puedo aportar valor a tu empresa. ¡Gracias por visitar mi perfil!'}
      </p>
    </main>
  );
}