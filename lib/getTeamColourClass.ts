import { Team } from './team'

export function getTeamColourClass(team: Team) {
	return `is-${team.abbreviation.toLowerCase()}`
}
