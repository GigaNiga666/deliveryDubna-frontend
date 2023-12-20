/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const withImages = require("next-images");

const nextConfig = {
    images : {
        formats : ['image/webp'],
        disableStaticImages: true
    },
    reactStrictMode: false,
    env : {
        API_URL: "http://localhost:5000/api/v1"
    },
}

module.exports = withPlugins([withImages], nextConfig)
