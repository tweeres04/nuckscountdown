import Link from 'next/link'
import { linearGradient } from '../lib/linearGradient'
import { colours } from '../lib/colours'
import { Team } from '../lib/team'
import Head from 'next/head'
import { paramCase } from 'change-case'
import Nav from '../lib/Nav'
import { getTeamColourClass } from '../lib/getTeamColourClass'

export { getStaticPaths } from '../lib/getStaticPaths'
import {
	getStaticPropsWithHeroVideoUrl,
	StaticPropsProps,
} from '../lib/getStaticProps'

export function getStaticProps(props: StaticPropsProps) {
	return getStaticPropsWithHeroVideoUrl(props)
}

export default function TeamComponent({
	team,
	heroVideo,
}: {
	team: Team
	heroVideo: string
}) {
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
								<Link href={`${paramCase(team.teamName)}/countdown`}>
									<a className={heroButtonClasses}>Start the countdown →</a>
								</Link>
							</div>
							<div className="column has-text-centered">
								<video
									src={`/hero/${heroVideo}`}
									className="hero-image"
									autoPlay
									muted
									loop
								>
									A video of{' '}
									{heroVideo === 'hero.mp4' ? 'Canucks' : team.teamName}{' '}
									Countdown in action
								</video>
								{team.abbreviation !== 'VAN' && heroVideo === 'hero.mp4' && (
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
