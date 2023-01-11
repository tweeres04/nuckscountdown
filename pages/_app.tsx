import Head from 'next/head'
import Script from 'next/script'
import '../styles/styles.scss'
import type { AppProps } from 'next/app'
import { Team } from '../lib/team'
import { colours } from '../lib/colours'

export default function MyApp({ Component, pageProps }: AppProps) {
	const team: Team | undefined = pageProps.team

	const lowercaseTeamAbbreviation = team?.abbreviation.toLowerCase()

	const logoPath = `/logos/${team?.abbreviation.toLowerCase()}.svg`

	const { primary: primaryColour } = lowercaseTeamAbbreviation
		? colours[lowercaseTeamAbbreviation]
		: { primary: '#000' }

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
					content="A slick looking countdown you save to your home screen. Always be amped up for the next game. Loads instantly."
				/>
				<link
					rel="manifest"
					href={`/api/manifest/${lowercaseTeamAbbreviation}`}
				/>
				<link rel="shortcut icon" href={logoPath} />
				// All the apple bullshit
				<meta
					name="apple-mobile-web-app-title"
					content={`${team?.name} Countdown`}
				/>
				<link rel="apple-touch-icon" href={logoPath} />
				<link rel="apple-touch-startup-image" href={logoPath} />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black" />
				// End apple bullshit
			</Head>
			<Component {...pageProps} />
			{process.env.NODE_ENV === 'production' && (
				<>
					{/* <!-- Google tag (gtag.js) --> */}
					<Script src="https://www.googletagmanager.com/gtag/js?id=G-3CY78LZ9G7"></Script>
					<script
						dangerouslySetInnerHTML={{
							__html: `window.dataLayer = window.dataLayer || [];
									function gtag(){dataLayer.push(arguments);}
									gtag('js', new Date());
									gtag('config', 'G-3CY78LZ9G7');`,
						}}
					></script>
				</>
			)}
		</>
	)
}
