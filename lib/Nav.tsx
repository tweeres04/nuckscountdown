import { useState } from 'react'
import Link from 'next/link'
import { paramCase } from 'change-case'

import { Team } from './team'
import { teams } from './teams'
import { getTeamColourClass } from './getTeamColourClass'

type Props = {
	team: Team
	pathSuffix?: string
}

export default function Nav({ team, pathSuffix = '' }: Props) {
	const teamColourClass = getTeamColourClass(team)
	const sortedTeams = teams.sort((a, b) => (a.name < b.name ? -1 : 1))
	const [showNavMenu, setShowNavMenu] = useState(false)
	const navbarClasses = `navbar ${teamColourClass}`
	const burgerClasses = showNavMenu
		? 'navbar-burger is-active'
		: 'navbar-burger'
	const menuClasses = showNavMenu ? `navbar-menu is-active` : `navbar-menu`
	return (
		<nav
			className={navbarClasses}
			role="navigation"
			aria-label="main navigation"
		>
			<div className="container">
				<div className="navbar-brand">
					<a className="navbar-item" href={`/${paramCase(team.teamName)}`}>
						NHL Countdown
					</a>
					<a
						role="button"
						className={burgerClasses}
						aria-label="menu"
						aria-expanded={showNavMenu ? 'true' : 'false'}
						onClick={() => {
							setShowNavMenu(!showNavMenu)
						}}
					>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</a>
				</div>
				<div className={menuClasses}>
					<div className="navbar-start">
						<div className="navbar-item has-dropdown is-hoverable">
							<div className="navbar-link">Teams</div>
							<div className="navbar-dropdown">
								{sortedTeams.map((team) => (
									// We can't use client side routing because iOS won't update the web app manifest properly when switching teams
									<a
										className="navbar-item"
										key={team.id}
										href={`/${paramCase(team.teamName)}${pathSuffix}`}
									>
										{team.name}
									</a>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}
