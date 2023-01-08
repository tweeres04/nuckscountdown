const withPwa = require('next-pwa')

/** @type {import('next').NextConfig} */
const nextConfig = withPwa({
	reactStrictMode: true,
	typescript: {
		ignoreBuildErrors: true,
	},
	pwa: {
		dest: 'public',
		disable: process.env.NODE_ENV != 'production',
	},
	redirects: async () => [
		{
			source: '/',
			destination: '/canucks',
			permanent: true,
		},
		{
			source: '/countdown',
			destination: '/canucks/countdown',
			permanent: true,
		},
	],
})

module.exports = nextConfig
