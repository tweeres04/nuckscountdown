import Head from 'next/head'

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import dateFormat from 'date-fns/format'
import addMonths from 'date-fns/addMonths'
import isPast from 'date-fns/isPast'
import countdown from 'countdown'
import { get, set } from 'idb-keyval'
import { paramCase } from 'change-case'

import { colours } from '../../lib/colours'

import getOpposingTeamName from '../../lib/getOpposingTeamName'
import { linearGradient } from '../../lib/linearGradient'
import Nav from '../../lib/Nav'
import { Team } from '../../lib/team'
import { getTeamColourClass } from '../../lib/getTeamColourClass'
import IosShareIcon from '../../lib/IosShareIcon'
import { BeforeInstallPromptEvent } from '../_app'

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
	gameType: 'PR' | 'R' | 'P'
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
	dateFormat: 'yyyy-MM-dd',
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
		`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${today}&endDate=${sixMonthsFromNow}&teamId=${teamId}&gameType=R,P`
	)

	const game = dates.length === 0 ? null : getNextGame(dates)
	set(idbKey(teamId), game)
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

			get<Game | null>(idbKey(teamId)).then((game) => {
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

function InstallNotification({
	team,
	deferredInstallPrompt,
}: {
	team: Team
	deferredInstallPrompt: BeforeInstallPromptEvent
}) {
	const [showInstallNotification, setShowInstallNotification] = useState(false)
	const [isIos, setIsIos] = useState(false)

	useEffect(() => {
		const isStandalone = window.matchMedia('(display-mode: standalone)').matches
		setShowInstallNotification(!isStandalone)
	}, [])

	useEffect(() => {
		// From https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent
		setIsIos(
			/Mobi/.test(window.navigator.userAgent) &&
				/AppleWebKit/.test(window.navigator.userAgent) &&
				!/Chrom/.test(window.navigator.userAgent)
		)
	}, [])

	return showInstallNotification ? (
		<div
			className={`notification ${getTeamColourClass(team)}`}
			style={{ position: 'fixed', bottom: 0, width: '100%', marginBottom: 0 }}
		>
			<button
				className="delete"
				onClick={() => {
					setShowInstallNotification(false)
				}}
			></button>
			<p className="has-text-centered">
				Install {team.name} Countdown to your home screen for quick access
			</p>
			{deferredInstallPrompt ? (
				<div className="has-text-centered mt-3">
					<button
						className={`button is-inverted ${getTeamColourClass(team)}`}
						onClick={() => {
							deferredInstallPrompt.prompt()
						}}
					>
						Add to home screen
					</button>
				</div>
			) : isIos ? (
				<p className="has-text-centered mt-1">
					Tap the share button (with this icon: <IosShareIcon />
					), then tap "Add to Home Screen"
				</p>
			) : null}
		</div>
	) : null
}

type Props = {
	team: Team
	deferredInstallPrompt: BeforeInstallPromptEvent
}

export default function Countdown({ team, deferredInstallPrompt }: Props) {
	const { loading, game } = useGame(team)
	const { abbreviation, teamName, name: fullTeamName } = team
	const { teams, gameDate: gameDateString, status, gameType } = game || {}
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

	const title = `${fullTeamName} Countdown`
	const canonicalUrl = `https://nhlcountdown.tweeres.ca/${paramCase(
		teamName
	)}/countdown`

	return (
		<>
			<Head>
				<title>{title}</title>
				<link rel="canonical" href={canonicalUrl} />
				// OpenGraph
				<meta property="og:title" content={title} />
				<meta property="og:type" content="website" />
				<meta property="og:url" content={canonicalUrl} />
				// End OpenGraph
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
					<div className="date">{dateFormat(gameDate, 'E MMM d, h:mm a')}</div>
				)}
				{opposingTeamName && (
					<div className="opponent">
						{isHome ? 'vs' : 'at'} {opposingTeamName}
					</div>
				)}
				{!loading && typeof navigator !== 'undefined' && navigator.share ? (
					<button
						className={`mt-6 button is-${abbreviation.toLowerCase()} is-inverted is-outlined is-small`}
						onClick={() => {
							navigator.share({
								title: `${fullTeamName} Countdown`,
								text: countdownString,
								url: `${document.location.href}?utm_source=nhlcountdown&utm_medium=share_button`,
							})
						}}
					>
						<IosShareIcon
							style={{ width: '1rem', height: '1rem', marginRight: '0.125rem' }}
						/>
						Share
					</button>
				) : null}
			</div>
			<InstallNotification
				team={team}
				deferredInstallPrompt={deferredInstallPrompt}
			/>
		</>
	)
}
