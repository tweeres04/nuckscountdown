import Head from 'next/head'
import '../styles/styles.scss'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Head>
				<title>Nucks Countdown</title>
				<meta
					name="description"
					content="A quick and beautiful way to see when the Vancouver Canucks play their next game"
				/>
				<link rel="icon" href="/nucks.png" />
			</Head>
			<Component {...pageProps} />
		</>
	)
}

export default MyApp
