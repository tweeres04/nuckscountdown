import Link from 'next/link'

import heroImage from '../public/hero.jpg'

export default function Index() {
	return (
		<>
			<div className="hero is-halfheight is-primary">
				<div className="hero-body">
					<div className="container">
						<div className="columns is-vcentered">
							<div className="column">
								<h1 className="title">
									Quickly see when the Vancouver Canucks play next
								</h1>
								<p className="subtitle">
									A fast and pretty web app that counts down to the next game.
									No need to check the entire schedule! Easily the best way to
									plan for today's or tonight's game.
								</p>
								<Link href="/countdown">
									<a className="button is-primary is-large is-inverted">
										See the countdown →
									</a>
								</Link>
							</div>
							<div className="column has-text-centered">
								<img src={heroImage.src} className="hero-image" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<footer className="footer">
				<div className="content has-text-centered">
					<div>Nucks Countdown by</div>
					<div>
						<a href="https://tweeres.ca">Tyler Weeres</a>
					</div>
				</div>
			</footer>
		</>
	)
}
