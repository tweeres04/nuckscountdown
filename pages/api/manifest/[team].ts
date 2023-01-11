import { NextApiRequest, NextApiResponse } from 'next'
import { colours } from '../../../lib/colours'
import { teams } from '../../../lib/teams'

export default async function manifestHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { team: teamParam } = req.query

	const team = teams.find((t) => t.abbreviation.toLowerCase() === teamParam)

	if (!team) {
		res.status(404).send('Team not found')
		return
	}

	const { primary: primaryColour } = colours[team.abbreviation.toLowerCase()]

	res.json({
		name: `${team.teamName} Countdown`,
		short_name: team.teamName,
		icons: [
			{
				src: `/logos/${team.abbreviation.toLowerCase()}.svg`,
				sizes: 'any',
			},
		],
		start_url: `/${team.teamName.toLowerCase()}/countdown`,
		display: 'standalone',
		theme_color: primaryColour,
		background_color: primaryColour,
	})
}
