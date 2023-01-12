import { useState } from 'react'
import Link from 'next/link'
import { paramCase } from 'change-case'

import { Team } from './team'
import { teams } from './teams'
import { getTeamColourClass } from './getTeamColourClass'

export default function Nav({
	team,
	pathSuffix = '',
}: {
	team: Team
	pathSuffix: string
}) {
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
							<a className="navbar-link">Teams</a>
							<div className="navbar-dropdown">
								{sortedTeams.map((team) => (
									<Link href={`/${paramCase(team.teamName)}${pathSuffix}`}>
										<a
											key={team.id}
											className="navbar-item"
											onClick={() => {
												setShowNavMenu(false)
											}}
										>
											{team.name}
										</a>
									</Link>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	)
}
