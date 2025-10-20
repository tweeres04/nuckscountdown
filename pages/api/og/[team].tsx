import { NextApiRequest, NextApiResponse } from 'next'
import { ImageResponse } from '@vercel/og'
import { strings } from '../../[team]/countdown'
import { isPast } from 'date-fns'
import { teams } from '../../../lib/teams'
import { colours } from '../../../lib/colours'
import { linearGradient } from '../../../lib/linearGradient'

export const runtime = 'edge'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === 'GET') {
		if (!req.url) {
			return res.status(500).json({ error: 'No URL in OG request' })
		}
		const url = new URL(req.url)
		const pathSegments = url.pathname.split('/')
		const teamParam = pathSegments[pathSegments.length - 1] // Gets "van" from "/api/og/van"

		const team = teams.find(
			(t) => t.abbreviation.toLowerCase() === teamParam.toLowerCase()
		)

		if (!team) {
			return res.status(404).json({ error: 'Team not found' })
		}

		const teamName = team.teamName

		const domain =
			process.env.NODE_ENV === 'production'
				? 'https://nhlcountdown.tweeres.com'
				: 'http://localhost:3000'

		const game = await fetch(
			`${domain}/api/games?team=${teamParam.toLowerCase()}`
		).then((response) => response.json())

		const { startTimeUTC: gameDateString, gameState, gameScheduleState } = game

		const gameIsTbd = gameScheduleState === 'TBD'

		const gameDate = gameDateString && new Date(gameDateString)

		const countdownString = !game
			? strings.noGame
			: gameState === 'LIVE' || gameState === 'CRIT' // in progress
			? strings.live(teamName)
			: gameState === 'PRE' && isPast(gameDate as Date) // about to start
			? strings.puckDrop
			: gameIsTbd // Game time not set yet
			? strings.tbd
			: strings.countdown(teamName, gameDate as Date)

		const teamColours = colours[team.abbreviation.toLowerCase()]

		return new ImageResponse(
			(
				<div
					className="countdown"
					style={{
						textAlign: 'center',
						fontSize: '5rem',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						width: '100%',
						height: '100%',
						background: linearGradient(teamColours),
						color: 'white',
						padding: '0 5rem',
					}}
				>
					<div>{countdownString}</div>
				</div>
			),
			{
				width: 1200,
				height: 630,
			}
		)
	}
}
