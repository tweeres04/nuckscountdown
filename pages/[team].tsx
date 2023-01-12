import Link from 'next/link'
import { linearGradient } from '../lib/linearGradient'
import { colours } from '../lib/colours'
import { Team, teamFactory } from '../lib/team'
import Head from 'next/head'
import { teams } from '../lib/teams'
import { useState } from 'react'

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

	return { props: { team: teamFactory(team as Team) } }
}

export default function TeamComponent({ team }: { team: Team }) {
	const teamColourClass = `is-${team.abbreviation.toLowerCase()}`
	const sortedTeams = teams.sort((a, b) => (a.name < b.name ? -1 : 1))
	const [showNavMenu, setShowNavMenu] = useState(false)
	const teamColours = colours[team.abbreviation.toLowerCase()]
	const navbarClasses = `navbar ${teamColourClass}`
	const burgerClasses = showNavMenu
		? 'navbar-burger is-active'
		: 'navbar-burger'
	const menuClasses = showNavMenu ? `navbar-menu is-active` : `navbar-menu`
	const heroClasses = `hero is-halfheight ${teamColourClass}`
	const heroButtonClasses = `button is-large is-inverted ${teamColourClass}`

	function toggleNavMenu() {
		setShowNavMenu(!showNavMenu)
	}

	return (
		<>
			<Head>
				<title>
					When do the {team.teamName} play next? Find out fast - {team.teamName}{' '}
					Countdown
				</title>
			</Head>
			<nav
				className={navbarClasses}
				role="navigation"
				aria-label="main navigation"
			>
				<div className="navbar-brand">
					<a className="navbar-item" href={`/${team.teamName.toLowerCase()}`}>
						NHL Countdown
					</a>

					<a
						role="button"
						className={burgerClasses}
						aria-label="menu"
						aria-expanded={showNavMenu ? 'true' : 'false'}
						onClick={toggleNavMenu}
					>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</a>
				</div>

				<div className={menuClasses}>
					<div className="navbar-start">
						<div className="navbar-item has-dropdown is-hoverable">
							<a className="navbar-link">Teams</a>

							<div className="navbar-dropdown">
								{sortedTeams.map((team) => (
									<Link href={`/${team.teamName.toLowerCase()}`}>
										<a
											key={team.id}
											className="navbar-item"
											onClick={toggleNavMenu}
										>
											{team.name}
										</a>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</nav>
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
								<Link href={`${team.teamName.toLowerCase()}/countdown`}>
									<a className={heroButtonClasses}>Start the countdown →</a>
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
