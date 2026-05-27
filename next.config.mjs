import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 解决 Webpack 在解析 next-intl 依赖时的警告
  webpack: (config, { isServer }) => {
    // 忽略特定的 Webpack 警告
    config.ignoreWarnings = [
      { module: /node_modules\/next-intl/ },
      { message: /Parsing of .* for build dependencies failed/ }
    ];
    return config;
  }
};

export default withNextIntl(nextConfig);
