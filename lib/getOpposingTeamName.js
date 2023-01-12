export default function getOpposingTeamName(fullTeamName, teams) {
	const { home, away } = teams || {}

	const result = [home, away]
		.map(({ team: { name } = {} } = {}) => name)
		.find((teamName) => teamName !== fullTeamName)

	return result
}
