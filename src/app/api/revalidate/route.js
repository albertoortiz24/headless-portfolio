import { revalidateTag } from 'next/cache';

export async function POST(request) {
  try {
    const { secret, tag } = await request.json();
    
    // Verifica que el secreto coincida con el de tu .env.local
    if (secret !== process.env.REVALIDATION_SECRET) {
      return new Response(JSON.stringify({ message: 'Invalid secret' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Revalida el tag especificado (ej: 'marcas')
    await revalidateTag(tag);
    
    return new Response(JSON.stringify({ revalidated: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error revalidating' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}