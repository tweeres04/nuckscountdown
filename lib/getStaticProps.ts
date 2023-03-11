import { paramCase } from 'change-case'
import { stat } from 'fs/promises'
import { join } from 'path'

import { teams } from './teams'
import { Team, teamFactory } from './team'

export type StaticPropsProps = {
	params: {
		team: string
	}
}

export async function getStaticPropsWithHeroVideoUrl(props: StaticPropsProps) {
	const existingProps = getStaticProps(props)

	let heroVideo = 'hero.mp4'
	try {
		const lowercaseAbbrev = existingProps.props.team.abbreviation.toLowerCase()
		await stat(
			join(
				__dirname,
				'..',
				'..',
				'..',
				'public',
				'hero',
				`${lowercaseAbbrev}.mp4`
			)
		)

		heroVideo = `${lowercaseAbbrev}.mp4`
	} catch (err) {
		if (err?.code !== 'ENOENT') {
			throw err
		}
	}

	return { props: { ...existingProps.props, heroVideo } }
}

export function getStaticProps({ params }: StaticPropsProps) {
	const team = teams.find(
		(t: Team) => paramCase(t.teamName) === paramCase(params.team)
	)

	return { props: { team: teamFactory(team as Team) } }
}
