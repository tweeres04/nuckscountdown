import { Team } from './team'
import { teams } from './teams'
import { paramCase } from 'change-case'

export async function getStaticPaths() {
	const paths = teams.map((t: Team) => ({
		params: { team: paramCase(t.teamName) },
	}))

	return {
		paths,
		fallback: false,
	}
}
