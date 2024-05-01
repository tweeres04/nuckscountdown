import { NextApiRequest, NextApiResponse } from 'next'
import * as Sentry from '@sentry/nextjs'
import { kv } from '@vercel/kv'
import { Game } from '../[team]/countdown'
import { isPast, isToday } from 'date-fns'

type NhlResponse = {
	games: Game[]
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const teamAbbrev = req.query.team
	const kvKey = `nhlcountdown:${teamAbbrev}`

	const cachedJson = await kv.get<NhlResponse>(kvKey)

	let nextGame = findNextCachedGame(cachedJson?.games)

	const nextGameDate = nextGame ? new Date(nextGame.startTimeUTC) : null

	if (
		!nextGame ||
		(nextGameDate && // only for type checker
			isToday(nextGameDate) &&
			isPast(nextGameDate)) ||
		nextGame.gameScheduleState === 'TBD'
	) {
		const response = await fetch(
			`https://api-web.nhle.com/v1/club-schedule/${teamAbbrev}/week/now`
		)

		if (response.ok) {
			const json = await response.json()
			kv.set(kvKey, json)
			nextGame = findNextGame(json.games)
		} else {
			console.error(response)
			let responseBody
			try {
				responseBody = await response.text()
			} catch (err) {
				console.error(err)
			}
			Sentry.captureException(new Error('Error fetching from NHL API'), {
				extra: {
					headers: response.headers,
					status: response.status,
					body: responseBody,
				},
			})
		}
	}

	res.json(nextGame)
}

function findNextGame(games?: Game[]) {
	return games?.find(liveGameNotOver)
}

function findNextCachedGame(games?: Game[]) {
	return games?.find((g) => {
		const gameDate = new Date(g.startTimeUTC)
		return isToday(gameDate) || !isPast(gameDate)
	})
}

function liveGameNotOver(game: Game) {
	return game.gameState !== 'OFF' && game.gameState !== 'FINAL'
}
