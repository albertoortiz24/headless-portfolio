/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'greenyellow-vulture-916371.hostingersite.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;