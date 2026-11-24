import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@billnote/shared', '@billnote/ui'],
  reactStrictMode: true,
}

export default nextConfig
