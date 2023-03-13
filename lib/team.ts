export type Team = {
	id: number
	name: string // full name
	abbreviation: string
	teamName: string // last name
	locationName: string
}

export function teamFactory({
	id,
	name,
	abbreviation,
	teamName,
	locationName,
}: Team): Team {
	return { id, name, abbreviation, teamName, locationName }
}
