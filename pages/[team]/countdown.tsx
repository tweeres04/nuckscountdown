import Head from 'next/head'

import React, { Component } from 'react'
import axios from 'axios'
import dateFormat from 'date-fns/format'
import addMonths from 'date-fns/add_months'
import isPast from 'date-fns/is_past'
import countdown from 'countdown'
import idbKeyval from 'idb-keyval'

import { colours } from '../../lib/colours'

import getOpposingTeamName from '../../lib/getOpposingTeamName'
import { linearGradient } from '../../lib/linearGradient'
import Nav from '../../lib/nav'

export { getStaticPaths } from '../../lib/getStaticPaths'
export { getStaticProps } from '../../lib/getStaticProps'

const strings = {
	noGame: 'No game scheduled',
	live: (teamName: string) => `${teamName} are live!`,
	puckDrop: 'Puck is about to drop!',
	countdown: (teamName: string, gameDate: Date) =>
		`${countdown(gameDate).toString()} till the ${teamName} play next`,
	dateFormat: 'YYYY-MM-DD',
}

function getNextGame(dates) {
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
	idbKeyval.set('game', game)
	return game
}

class CountdownContainer extends Component {
	state = { loading: true, game: null, now: new Date() }
	async componentDidMount() {
		const { id: teamId } = this.props.team
		let game = await idbKeyval.get('game')

		const gameDate = new Date(game?.gameDate)

		if (game && !isPast(gameDate)) {
			this.setState({ loading: false, game })
		}

		getGameFromNhlApi(teamId).then((game) => {
			this.setState({ loading: false, game })
		})

		this.intervalHandle = setInterval(() => {
			this.setState({ now: new Date() })
		}, 1000)
	}
	render() {
		const { loading, game } = this.state
		return <Countdown loading={loading} game={game} team={this.props.team} />
	}
	componentWillUnmount() {
		clearInterval(this.intervalHandle)
	}
}

function Countdown({ loading, game, team }) {
	const { abbreviation, teamName, teamName: fullTeamName } = team
	const { status: { abstractGameState } = {} } = game || {}
	let { gameDate, teams } = game || {}

	gameDate = gameDate && new Date(gameDate)

	const countdownString = !game
		? strings.noGame
		: abstractGameState === 'Live'
		? strings.live(teamName)
		: abstractGameState === 'Preview' && isPast(gameDate)
		? strings.puckDrop
		: strings.countdown(teamName, gameDate)

	const opposingTeamName = getOpposingTeamName(fullTeamName, teams)

	const teamColours = colours[abbreviation.toLowerCase()] || {
		primary: 'black',
		secondary: 'grey',
	}

	return (
		<>
			<Head>
				<meta name="robots" content="noindex" />
				<title>{teamName} Countdown</title>
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
					<div className="opponent">vs {opposingTeamName}</div>
				)}
			</div>
		</>
	)
}

export default CountdownContainer
