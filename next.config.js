const { withSentryConfig } = require('@sentry/nextjs')

const withPwa = require('next-pwa')({
	dest: 'public',
	disable: process.env.NODE_ENV != 'production',
})

/** @type {import('next').NextConfig} */
const nextConfig = withPwa({
	reactStrictMode: true,
	typescript: {
		ignoreBuildErrors: true,
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

module.exports = withSentryConfig(
	nextConfig,
	{ silent: true },
	{ hideSourcemaps: true }
)
