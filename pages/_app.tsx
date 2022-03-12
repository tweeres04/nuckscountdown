import Head from 'next/head'
import '../styles/styles.scss'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>
				<meta name="theme-color" content="rgb(4, 30, 66)" />
				<meta
					name="description"
					content="A slick looking countdown you can save to your home screen so you can always be amped up for the next game. Loads instantly."
				/>
				<link rel="manifest" href="/manifest.json" />
				<link rel="shortcut icon" href="/nucks.png" />
				// All the apple bullshit
				<meta name="apple-mobile-web-app-title" content="Nucks Countdown" />
				<link rel="apple-touch-icon" href="%PUBLIC_URL%/nucks.png" />
				<link rel="apple-touch-startup-image" href="%PUBLIC_URL%/nucks.png" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black" />
				<title>
					Quickly find out when the Vancouver Canucks play next - Nucks
					Countdown
				</title>
			</Head>
			<Component {...pageProps} />
		</>
	)
}

export default MyApp
