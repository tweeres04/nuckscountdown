const { withSentryConfig } = require('@sentry/nextjs')

const withPwa = require('next-pwa')({
	dest: 'public',
	disable: process.env.NODE_ENV != 'production',
	publicExcludes: ['!hero/*', '!logos/*', '!sitemap.xml'],
})

/** @type {import('next').NextConfig} */
const nextConfig = withPwa({
	reactStrictMode: true,
	typescript: {
		ignoreBuildErrors: true,
	},
})

module.exports = withSentryConfig(
	nextConfig,
	{ silent: true },
	{ hideSourcemaps: true }
)
