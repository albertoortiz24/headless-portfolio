"use client";

import Image from 'next/image';

export default function CarouselCard({ image, index }) {
  return (
    <div 
      className="absolute w-full h-full"
      style={{
        top: `${index * 100}%`,
      }}
    >
      {/* Imagen de fondo */}
      <div className="relative w-full h-full">
        <Image
          src={image.url}
          alt={image.title}
          fill
          className="object-cover"
          priority={index === 0}
        />
        
        {/* Overlay gradiente para mejor legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Texto superpuesto en la imagen */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
          <p className="text-gray-200">{image.description}</p>
        </div>
      </div>
    </div>
  );
}