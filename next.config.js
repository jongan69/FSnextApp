const isProd = process.env.NODE_ENV === 'production'

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  assetPrefix: isProd ? 'https://cdn.statically.io/gh/jongan69/jongan69.github.io/gh-pages/' : '',
}