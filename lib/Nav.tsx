import { useState } from 'react'
import { paramCase } from 'change-case'
import { FeedbackFish } from '@feedback-fish/react'

import { Team } from './team'
import { teams } from './teams'
import { getTeamColourClass } from './getTeamColourClass'

type Props = {
	team?: Team
	pathSuffix?: string
}

export default function Nav({ team, pathSuffix = '' }: Props) {
	const teamColourClass = team ? getTeamColourClass(team) : 'is-black'
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
					<a
						className="navbar-item"
						href={`/${team ? paramCase(team.teamName) : ''}`}
					>
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
						<FeedbackFish
							projectId={
								process.env.NEXT_PUBLIC_FEEDBACK_FISH_PROJECT_ID as string
							}
						>
							{/* For some reason bulma's `is-clickable` helper didn't work here */}
							<div className="navbar-item" style={{ cursor: 'pointer' }}>
								Send feedback
							</div>
						</FeedbackFish>
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
