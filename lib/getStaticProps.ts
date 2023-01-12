import { teams } from './teams'
import { Team, teamFactory } from './team'
import { paramCase } from 'change-case'

export async function getStaticProps({ params }: { params: { team: string } }) {
	const team = teams.find(
		(t: Team) => paramCase(t.teamName) === paramCase(params.team)
	)

	return { props: { team: teamFactory(team as Team) } }
}
