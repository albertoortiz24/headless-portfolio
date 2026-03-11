import { redirect } from 'next/navigation';

export default function RootPage() {
  // Detectar idioma del navegador o usar español por defecto
  // Por ahora, redirigimos a español
  redirect('/es');
}