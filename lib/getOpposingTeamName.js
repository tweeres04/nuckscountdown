export default function getOpposingTeamName(fullTeamName, teams) {
	const { home, away } = teams || {}

	const result = [home, away]
		.map(({ team: { name } = {} } = {}) => name)
		.filter((teamName) => teamName !== fullTeamName)[0]

	return result
}
