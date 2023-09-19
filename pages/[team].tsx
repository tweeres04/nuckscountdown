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

export default function TeamLandingPage({ team }: { team: Team }) {
	const teamColourClass = getTeamColourClass(team)
	const teamColours = colours[team.abbreviation.toLowerCase()]
	const heroClasses = `hero is-halfheight ${teamColourClass}`
	const heroButtonClasses = `button is-large is-inverted ${teamColourClass}`

	return (
		<>
			<Head>
				<title>
					When do the {team.teamName} play next? - {team.name} Countdown
				</title>
				<link
					rel="canonical"
					href={`https://nhlcountdown.tweeres.ca/${paramCase(team.teamName)}`}
				/>
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
									need to check the schedule.
								</p>
								<Link
									href={`/${paramCase(team.teamName)}/countdown`}
									className={heroButtonClasses}
								>
									Start the countdown →
								</Link>
							</div>
							<div className="column has-text-centered">
								<video
									width="326"
									height="706"
									src={`/hero/${team.abbreviation.toLowerCase()}.mp4`}
									className="hero-media"
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
