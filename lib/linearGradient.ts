import { TeamColour } from './colours'

export function linearGradient(teamColours: TeamColour) {
	return `linear-gradient(
			to bottom,
			${teamColours.primary},
			${teamColours.secondary}
			)`
}
