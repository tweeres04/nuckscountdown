import { teams } from './teams'

export default function getOpposingTeamName(teamId, home, away) {
	const resultId = [home, away]
		.map(({ id } = {}) => id)
		.find((id) => id !== teamId)

	const team = teams.find(({ id }) => id === resultId)

	return team?.name
}
