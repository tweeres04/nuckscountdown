import { useState, useEffect } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import '../styles/styles.scss'
import type { AppProps } from 'next/app'
import { Team } from '../lib/team'
import { colours } from '../lib/colours'

export interface BeforeInstallPromptEvent extends Event {
	prompt: () => void
}

function useDeferredInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent>()
	useEffect(() => {
		window.addEventListener('beforeinstallprompt', (e) => {
			e.preventDefault()
			setDeferredPrompt(e as BeforeInstallPromptEvent)
		})
	}, [])

	return deferredPrompt
}

function useSendDisplayModeToAnalytics() {
	// From https://web.dev/customize-install/#detect-launch-type
	function getPWADisplayMode() {
		const isStandalone = window.matchMedia('(display-mode: standalone)').matches
		if (document.referrer.startsWith('android-app://')) {
			return 'twa'
		} else if (navigator.standalone || isStandalone) {
			return 'standalone'
		}
		return 'browser'
	}

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') {
			const displayMode = getPWADisplayMode()

			gtag('set', 'user_properties', {
				display_mode: displayMode,
			})
		}
	}, [])
}

export default function MyApp({ Component, pageProps }: AppProps) {
	const team: Team | undefined = pageProps.team

	useSendDisplayModeToAnalytics()
	const deferredInstallPrompt = useDeferredInstallPrompt()

	const lowercaseTeamAbbreviation = team?.abbreviation.toLowerCase()

	// const svgLogoPath = lowercaseTeamAbbreviation
	// 	? `/logos/${lowercaseTeamAbbreviation}.svg`
	// 	: '/countdown.svg'
	const pngLogoPath = lowercaseTeamAbbreviation
		? `/logos/${lowercaseTeamAbbreviation}.png`
		: '/puck.png'

	const ogImagePath = lowercaseTeamAbbreviation
		? `/og/${lowercaseTeamAbbreviation}.png`
		: '/og/fla.png'

	const { primary: primaryColour } = lowercaseTeamAbbreviation
		? colours[lowercaseTeamAbbreviation]
		: { primary: '#000' }

	pageProps = {
		...pageProps,
		deferredInstallPrompt,
	}

	const description = `The fastest and prettiest way to get pumped for the next ${
		team ? team.name : 'NHL'
	} game. Launches instantly from your home screen.`

	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>
				<meta name="theme-color" content={primaryColour} />
				<meta name="description" content={description} />
				{lowercaseTeamAbbreviation ? (
					<link
						rel="manifest"
						id="webAppManifestLink"
						href={`/api/manifest/${lowercaseTeamAbbreviation}`}
					/>
				) : null}
				<link rel="shortcut icon" href={pngLogoPath} />
				// All the apple bullshit
				<meta
					name="apple-mobile-web-app-title"
					content={`${team ? team.name : 'NHL'} Countdown`}
				/>
				<link rel="apple-touch-icon" href={pngLogoPath} />
				<link rel="apple-touch-startup-image" href={pngLogoPath} />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black" />
				// OpenGraph
				<meta property="og:type" content="website" />
				<meta
					property="og:image"
					content={`https://nhlcountdown.tweeres.com${ogImagePath}`}
				/>
				<meta property="og:description" content={description} />
				<meta
					property="og:video"
					content={`https://nhlcountdown.tweeres.com/hero/${
						team ? team.abbreviation.toLowerCase() : 'canucks'
					}.mp4`}
				/>
				// End OpenGraph
				<script
					src="https://analytics.ahrefs.com/analytics.js"
					data-key="OR25pSoDpycSw5Y6N2q99Q"
					async
				></script>
				{/* Simple analytics */}
				<script
					data-collect-dnt="true"
					async
					src="https://scripts.simpleanalyticscdn.com/latest.js"
				></script>
			</Head>
			<Component {...pageProps} />
			{process.env.NODE_ENV === 'production' && (
				<>
					{/* <!-- Google tag (gtag.js) --> */}
					<Script
						src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`}
					></Script>
					<script
						dangerouslySetInnerHTML={{
							__html: `window.dataLayer = window.dataLayer || [];
									function gtag(){dataLayer.push(arguments);}
									gtag('js', new Date());
									gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}');`,
						}}
					></script>
				</>
			)}
		</>
	)
}
