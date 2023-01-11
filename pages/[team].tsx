import Link from 'next/link'
import { linearGradient } from '../lib/linearGradient'
import { colours } from '../lib/colours'
import { Team, teamFactory } from '../lib/team'
import Head from 'next/head'
import { teams } from '../lib/teams'

export async function getStaticPaths() {
	const paths = teams.map((t: Team) => ({
		params: { team: t.teamName.toLowerCase() },
	}))

	return {
		paths,
		fallback: false,
	}
}

export async function getStaticProps({ params }: { params: { team: string } }) {
	const team = teams.find(
		(t: Team) => t.teamName.toLowerCase() === params.team.toLowerCase()
	)

	return { props: { team: teamFactory(team) } }
}

export default function TeamComponent({ team }: { team: Team }) {
	const teamColours = colours[team.abbreviation.toLowerCase()]
	return (
		<>
			<Head>
				<title>
					When do the {team.teamName} play next? Find out fast - {team.teamName}{' '}
					Countdown
				</title>
			</Head>
			<div
				className="hero is-halfheight is-primary"
				style={{ background: linearGradient(teamColours) }}
			>
				<div className="hero-body">
					<div className="container">
						<div className="columns is-vcentered">
							<div className="column">
								<h1 className="title">
									Get pumped for the next {team.teamName} game!
								</h1>
								<p className="subtitle">
									A fast, pretty web app that counts down to the next game. No
									need to check the schedule. The best way to plan for tonight's
									game.
								</p>
								<Link href={`${team.teamName.toLowerCase()}/countdown`}>
									<a className="button is-dark is-large is-inverted">
										Start the countdown →
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
									A video of {team.teamName} Countdown counting down to today's
									game
								</video>
								{team.abbreviation !== 'VAN' && (
									<p>
										<small>
											Clip from the Canucks version of the countdown
										</small>
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<footer className="footer">
				<div className="content has-text-centered">
					<div>{team.teamName} Countdown by</div>
					<div>
						<a href="https://tweeres.ca">Tyler Weeres</a>
					</div>
				</div>
			</footer>
		</>
	)
}
