import Head from 'next/head'
import Script from 'next/script'
import '../styles/styles.scss'
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
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
					content="A slick looking countdown you save to your home screen. Always be amped up for the next game. Loads instantly."
				/>
				<link rel="manifest" href="/manifest.json" />
				<link rel="shortcut icon" href="/nucks.png" />
				// All the apple bullshit
				<meta name="apple-mobile-web-app-title" content="Nucks Countdown" />
				<link rel="apple-touch-icon" href="%PUBLIC_URL%/nucks.png" />
				<link rel="apple-touch-startup-image" href="%PUBLIC_URL%/nucks.png" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="black" />
			</Head>
			<Component {...pageProps} />
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
	)
}
