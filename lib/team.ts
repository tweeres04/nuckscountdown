export type Team = {
	id: number
	name: string
	abbreviation: string
	team: string
	teamName: string
	locationName: string
}

export function teamFactory({
	id,
	name,
	abbreviation,
	teamName,
	locationName,
}: Team): Team {
	return { id, name, abbreviation, team: abbreviation, teamName, locationName }
}
