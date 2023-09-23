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

export default function MyApp({ Component, pageProps }: AppProps) {
	const team: Team | undefined = pageProps.team

	const deferredInstallPrompt = useDeferredInstallPrompt()

	const lowercaseTeamAbbreviation = team?.abbreviation.toLowerCase()

	const svgLogoPath = `/logos/${lowercaseTeamAbbreviation}.svg`
	const pngLogoPath = `/logos/${lowercaseTeamAbbreviation}.png`

	const { primary: primaryColour } = lowercaseTeamAbbreviation
		? colours[lowercaseTeamAbbreviation]
		: { primary: '#000' }

	pageProps = {
		...pageProps,
		deferredInstallPrompt,
	}

	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>
				<meta name="theme-color" content={primaryColour} />
				<meta
					name="description"
					content={`The fastest and prettiest way to check the next ${team?.name} game. Launches instantly from your home screen.`}
				/>
				<link
					rel="manifest"
					id="webAppManifestLink"
					href={`/api/manifest/${lowercaseTeamAbbreviation}`}
				/>
				<link rel="shortcut icon" href={svgLogoPath} />
				// All the apple bullshit
				<meta
					name="apple-mobile-web-app-title"
					content={`${team?.name} Countdown`}
				/>
				<link rel="apple-touch-icon" href={pngLogoPath} />
				<link rel="apple-touch-startup-image" href={pngLogoPath} />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black" />
				// End apple bullshit
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
