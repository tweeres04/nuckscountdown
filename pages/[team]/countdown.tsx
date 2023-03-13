import Head from 'next/head'

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import dateFormat from 'date-fns/format'
import addMonths from 'date-fns/add_months'
import isPast from 'date-fns/is_past'
import countdown from 'countdown'
import idbKeyval from 'idb-keyval'

import { colours } from '../../lib/colours'

import getOpposingTeamName from '../../lib/getOpposingTeamName'
import { linearGradient } from '../../lib/linearGradient'
import Nav from '../../lib/Nav'
import { Team } from '../../lib/team'

export { getStaticPaths } from '../../lib/getStaticPaths'
export { getStaticProps } from '../../lib/getStaticProps'

type GameTeam = {
	team: {
		id: number
		name: string
	}
}

type Game = {
	status: {
		abstractGameState: string
	}
	gameDate: string
	teams: {
		away: GameTeam
		home: GameTeam
	}
}

type GameDate = {
	games: Game[]
}

function idbKey(teamId: number) {
	return `game-${teamId}`
}

const strings = {
	noGame: 'No game scheduled',
	live: (teamName: string) => `${teamName} are live!`,
	puckDrop: 'Puck is about to drop!',
	countdown: (teamName: string, gameDate: Date) =>
		`${countdown(gameDate).toString()} till the ${teamName} play next`,
	dateFormat: 'YYYY-MM-DD',
}

function getNextGame(dates: GameDate[]) {
	let [
		{
			games: [game],
		},
	] = dates
	const {
		status: { abstractGameState },
	} = game
	return abstractGameState === 'Final' ? dates[1] && dates[1].games[0] : game
}

async function getGameFromNhlApi(teamId: number) {
	const today = dateFormat(new Date(), strings.dateFormat)
	const sixMonthsFromNow = dateFormat(
		addMonths(new Date(), 6),
		strings.dateFormat
	)
	const {
		data: { dates },
	} = await axios(
		`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${today}&endDate=${sixMonthsFromNow}&teamId=${teamId}`
	)

	const game = dates.length === 0 ? null : getNextGame(dates)
	idbKeyval.set(idbKey(teamId), game)
	return game
}

function useGame(team: Team) {
	const [loading, setIsLoading] = useState(true)
	const [game, setGame] = useState<Game | null>(null)
	const [, setNow] = useState(new Date())
	const intervalHandleRef = useRef<number>()

	useEffect(() => {
		async function fetchGame() {
			setIsLoading(true)
			setGame(null)
			cleanup()

			const { id: teamId } = team

			idbKeyval.get<Game | null>(idbKey(teamId)).then((game) => {
				if (!game) {
					return
				}

				const gameDate = new Date(game.gameDate)

				if (!isPast(gameDate)) {
					setIsLoading(false)
					setGame(game)
				}
			})

			getGameFromNhlApi(teamId).then((game) => {
				setIsLoading(false)
				setGame(game)
			})

			intervalHandleRef.current = window.setInterval(() => {
				setNow(new Date())
			}, 1000)
		}

		function cleanup() {
			clearInterval(intervalHandleRef.current)
		}

		fetchGame()

		return cleanup
	}, [team])

	return { loading, game }
}

type Props = {
	team: Team
}

export default function Countdown({ team }: Props) {
	const { loading, game } = useGame(team)
	const { abbreviation, teamName, name: fullTeamName } = team
	const { teams, gameDate: gameDateString, status } = game || {}
	const { abstractGameState } = status || {}

	const gameDate = gameDateString && new Date(gameDateString)

	const countdownString = !game
		? strings.noGame
		: abstractGameState === 'Live'
		? strings.live(teamName)
		: abstractGameState === 'Preview' && isPast(gameDate as Date)
		? strings.puckDrop
		: strings.countdown(teamName, gameDate as Date)

	const opposingTeamName = getOpposingTeamName(fullTeamName, teams)

	const isHome = game?.teams?.home?.team?.id === team.id

	const teamColours = colours[abbreviation.toLowerCase()] || {
		primary: 'black',
		secondary: 'grey',
	}

	return (
		<>
			<Head>
				<meta name="robots" content="noindex" />
				<title>{fullTeamName} Countdown</title>
			</Head>
			<Nav team={team} pathSuffix="/countdown" />
			<div
				className="App"
				style={{
					background: linearGradient(teamColours),
				}}
			>
				<img
					className="logo"
					style={{ width: '256px', height: 'auto', margin: 'auto' }}
					src={`/logos/${abbreviation.toLowerCase()}.svg`}
					alt={`${fullTeamName} logo`}
				/>
				{loading || <div className="countdown">{countdownString}</div>}
				{gameDate && (
					<div className="date">
						{dateFormat(gameDate, 'ddd MMM D, h:mm A')}
					</div>
				)}
				{opposingTeamName && (
					<div className="opponent">
						{isHome ? 'vs' : 'at'} {opposingTeamName}
					</div>
				)}
			</div>
		</>
	)
}
