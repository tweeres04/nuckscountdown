import Head from 'next/head'

import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import dateFormat from 'date-fns/format'
import isPast from 'date-fns/isPast'
import isToday from 'date-fns/isToday'
import countdown from 'countdown'
import { get, set } from 'idb-keyval'
import { paramCase } from 'change-case'
import * as Sentry from '@sentry/nextjs'
import { FeedbackFish } from '@feedback-fish/react'

import { colours } from '../../lib/colours'

import getOpposingTeamName from '../../lib/getOpposingTeamName'
import { linearGradient } from '../../lib/linearGradient'
import Nav from '../../lib/Nav'
import { Team } from '../../lib/team'
import { getTeamColourClass } from '../../lib/getTeamColourClass'
import IosShareIcon from '../../lib/IosShareIcon'
import CommentIcon from '../../lib/CommentIcon'
import { BeforeInstallPromptEvent } from '../_app'
import Script from 'next/script'

export { getStaticPaths } from '../../lib/getStaticPaths'
export { getStaticProps } from '../../lib/getStaticProps'

type GameTeam = {
	id: number
	abbrev: string
}

export type Game = {
	gameState: string // 'FUT' | 'OFF' | 'LIVE' | 'CRIT' | 'PRE' | 'FINAL'
	startTimeUTC: string
	gameType: number // 2 (regular season) | 3 (playoffs) | ...
	awayTeam: GameTeam
	homeTeam: GameTeam
	gameScheduleState: string // 'TBD' | 'OK' | ...
}

function idbKey(teamAbbrev: string) {
	return `game-${teamAbbrev}`
}

const strings = {
	noGame: 'No game scheduled this week',
	live: (teamName: string) => `${teamName} are live!`,
	puckDrop: 'Puck is about to drop!',
	countdown: (teamName: string, gameDate: Date) =>
		`${countdown(gameDate).toString()} till the ${teamName} play next`,
	dateFormat: 'yyyy-MM-dd',
	tbd: 'Game time TBD',
}

async function getGameFromNhlApi(teamAbbrev: string) {
	try {
		const { data: game } = await axios(`/api/games?team=${teamAbbrev}`)

		set(idbKey(teamAbbrev), game)
		return game
	} catch (error) {
		let context
		if (error.response) {
			context = {
				extra: {
					headers: error.response.headers,
					status: error.response.status,
					body: error.response.data,
				},
			}
		}

		Sentry.captureException(error, context)

		return null
	}
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

			const { abbreviation } = team

			get<Game | null>(idbKey(abbreviation)).then((game) => {
				if (!game) {
					return
				}

				const gameDate = new Date(game.startTimeUTC)

				if (!isPast(gameDate) || isToday(gameDate)) {
					setIsLoading(false)
					setGame(game)
				}
			})

			getGameFromNhlApi(abbreviation).then((game) => {
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

function TbdUpdateNotification({ team }: { team: Team }) {
	const localStorageKey = '2024-05-01 TBD game update dismissed'
	const now = Date.now()
	const [show, setShow] = useState(() =>
		now > new Date(2024, 5, 1).getTime()
			? false
			: localStorage.getItem(localStorageKey) === null
	)

	function hide() {
		setShow(false)
		localStorage.setItem(localStorageKey, Date.now().toString())
	}

	return (
		<div
			className={`notification ${getTeamColourClass(
				team
			)} is-size-6 has-text-centered`}
			style={{
				position: 'fixed',
				bottom: 0,
				width: '100%',
				marginBottom: 0,
				display: show ? undefined : 'none',
			}}
		>
			<button className="delete" onClick={hide}></button>
			<p>
				<strong>Update:</strong> {team.teamName} Countdown shows TBD games
				properly now
			</p>
			<button
				className={`button is-inverted mt-3 ${getTeamColourClass(team)}`}
				onClick={hide}
			>
				Got it
			</button>
		</div>
	)
}

function TallyForm() {
	return (
		<>
			<Script async src="https://tally.so/widgets/embed.js"></Script>
			<Script id="tally_config">
				{`window.TallyConfig = {
					"formId": "nW4egR",
					"popup": {
						"emoji": {
						"text": "🏒",
						"animation": "wave"
						},
						"open": {
							"trigger": "time",
							"ms": 15000
						},
						"hideTitle": true,
						"doNotShowAfterSubmit": true
					}
				};`}
			</Script>
		</>
	)
}

type Props = {
	team: Team
	deferredInstallPrompt: BeforeInstallPromptEvent
}

export default function Countdown({ team, deferredInstallPrompt }: Props) {
	const { loading, game } = useGame(team)
	const { id, abbreviation, teamName, name: fullTeamName } = team
	const {
		awayTeam,
		homeTeam,
		startTimeUTC: gameDateString,
		gameState,
		gameScheduleState,
	} = game || {}

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

	const opposingTeamName = getOpposingTeamName(id, homeTeam, awayTeam)

	const isHome = homeTeam?.id === team.id

	const teamColours = colours[abbreviation.toLowerCase()] || {
		primary: 'black',
		secondary: 'grey',
	}

	const title = `${fullTeamName} Countdown`
	const canonicalUrl = `https://nhlcountdown.tweeres.com/${paramCase(
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
					<div className="date">
						{dateFormat(gameDate, `E MMM d${gameIsTbd ? '' : ', h:mm a'}`)}
					</div>
				)}
				{opposingTeamName && (
					<div className="opponent">
						{isHome ? 'vs' : 'at'} {opposingTeamName}
					</div>
				)}
				{!loading && typeof navigator !== 'undefined' && navigator.share ? (
					<>
						<button
							className={`mt-6 button is-${abbreviation.toLowerCase()} is-inverted is-outlined is-small`}
							onClick={() => {
								navigator
									.share({
										title: `${fullTeamName} Countdown`,
										text: countdownString,
										url: `${document.location.href}?utm_source=nhlcountdown&utm_medium=share_button`,
									})
									.catch((err) => {
										// Swallow so we don't send to sentry
									})
							}}
						>
							<IosShareIcon
								style={{
									width: '1rem',
									height: '1rem',
									marginRight: '0.125rem',
								}}
							/>
							Share
						</button>{' '}
					</>
				) : null}
				{!loading ? (
					<FeedbackFish
						projectId={
							process.env.NEXT_PUBLIC_FEEDBACK_FISH_PROJECT_ID as string
						}
					>
						<button
							className={`mt-6 button is-${abbreviation.toLowerCase()} is-inverted is-outlined is-small`}
						>
							<CommentIcon
								style={{
									width: '1rem',
									height: '1rem',
									marginRight: '0.125rem',
								}}
							/>
							Feedback
						</button>
					</FeedbackFish>
				) : null}
			</div>
			<InstallNotification
				team={team}
				deferredInstallPrompt={deferredInstallPrompt}
			/>
			{gameIsTbd ? <TbdUpdateNotification team={team} /> : null}
			<TallyForm />
		</>
	)
}
