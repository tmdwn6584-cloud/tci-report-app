/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Vercel에서 더 나은 성능을 위해
    optimizePackageImports: ['lucide-react'],
  },
  // 빌드 최적화
  swcMinify: true,
  // 정적 파일 최적화
  images: {
    unoptimized: true, // Vercel에서 이미지 최적화 비활성화로 호환성 향상
  },
}

module.exports = nextConfig