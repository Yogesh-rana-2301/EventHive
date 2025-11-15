/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/landing",
        destination: "/landing_page/index.html",
      },
      {
        source: "/landing/:path*",
        destination: "/landing_page/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
