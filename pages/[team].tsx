import Link from 'next/link'
import { linearGradient } from '../lib/linearGradient'
import { colours } from '../lib/colours'
import { Team } from '../lib/team'
import Head from 'next/head'
import { paramCase } from 'change-case'
import Nav from '../lib/Nav'
import { getTeamColourClass } from '../lib/getTeamColourClass'

export { getStaticPaths } from '../lib/getStaticPaths'
export { getStaticProps } from '../lib/getStaticProps'
import { useUpdateWebAppManifest } from '../lib/useUpdateWebAppManifest'

export default function TeamLandingPage({ team }: { team: Team }) {
	useUpdateWebAppManifest(team.abbreviation)
	const teamColourClass = getTeamColourClass(team)
	const teamColours = colours[team.abbreviation.toLowerCase()]
	const heroClasses = `hero is-halfheight ${teamColourClass}`
	const heroButtonClasses = `button is-large is-inverted ${teamColourClass}`

	return (
		<>
			<Head>
				<title>
					When do the {team.teamName} play next? Find out fast - {team.teamName}{' '}
					Countdown
				</title>
			</Head>
			<Nav team={team} />
			<div
				className={heroClasses}
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
								<Link href={`/${paramCase(team.teamName)}/countdown`}>
									<a className={heroButtonClasses}>Start the countdown →</a>
								</Link>
							</div>
							<div className="column has-text-centered">
								<video
									src={`/hero/${team.abbreviation.toLowerCase()}.mp4`}
									className="hero-image"
									autoPlay
									playsInline
									muted
									loop
								>
									A video of {team.teamName} Countdown in action
								</video>
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
