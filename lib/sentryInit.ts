import { init, SentryWebpackPluginOptions } from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN

export function sentryInit(extraConfig: SentryWebpackPluginOptions) {
	init({
		dsn: SENTRY_DSN,
		// Adjust this value in production, or use tracesSampler for greater control
		tracesSampleRate: 1.0,
		// ...
		// Note: if you want to override the automatic release value, do not set a
		// `release` value here - use the environment variable `SENTRY_RELEASE`, so
		// that it will also get attached to your source maps
		replaysSessionSampleRate: 0.01,
		// If the entire session is not sampled, use the below sample rate to sample
		// sessions when an error occurs.
		replaysOnErrorSampleRate: 1.0,
		...extraConfig,
	})
}
