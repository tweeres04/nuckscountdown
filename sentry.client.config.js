// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { Replay } from '@sentry/nextjs'

import { sentryInit } from './lib/sentryInit'
sentryInit({
	integrations: [new Replay()],
})
