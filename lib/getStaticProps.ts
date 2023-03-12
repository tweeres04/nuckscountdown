import { paramCase } from 'change-case'

import { teams } from './teams'
import { Team, teamFactory } from './team'

export type StaticPropsProps = {
	params: {
		team: string
	}
}

export function getStaticProps({ params }: StaticPropsProps) {
	const team = teams.find(
		(t: Team) => paramCase(t.teamName) === paramCase(params.team)
	)

	return { props: { team: teamFactory(team as Team) } }
}
