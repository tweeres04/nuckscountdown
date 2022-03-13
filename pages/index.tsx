import Link from 'next/link'

export default function Index() {
	return (
		<>
			<div className="hero is-halfheight is-primary">
				<div className="hero-body">
					<div className="container">
						<div className="columns is-vcentered">
							<div className="column">
								<h1 className="title">Get pumped for the next Canucks game!</h1>
								<p className="subtitle">
									A fast, pretty web app that counts down to the next game. No
									need to check the schedule. The best way to plan for today's
									or tonight's game.
								</p>
								<Link href="/countdown">
									<a className="button is-primary is-large is-inverted">
										See the countdown →
									</a>
								</Link>
							</div>
							<div className="column has-text-centered">
								<video
									width={400}
									src="/hero.mp4"
									className="hero-image"
									autoPlay
									muted
									loop
								>
									A video of Nucks Countdown counting down to today's game
								</video>
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
