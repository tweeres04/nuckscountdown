export default function getOpposingTeamName(teams) {
	const { home, away } = teams || {};

	const result = [home, away]
		.map(({ team: { name } = {} } = {}) => name)
		.filter(teamName => teamName !== 'Vancouver Canucks')[0];

	return result;
}
