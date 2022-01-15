import React, { Component } from 'react'
import axios from 'axios'
import dateFormat from 'date-fns/format'
import addMonths from 'date-fns/add_months'
import isPast from 'date-fns/is_past'
import countdown from 'countdown'
import idbKeyval from 'idb-keyval'

import Logo from './NucksLogo'
import getOpposingTeamName from './getOpposingTeamName'

const strings = {
	noGame: 'No game scheduled',
	live: 'Nucks are live!',
	puckDrop: 'Puck is about to drop!',
	countdown: (gameDate) =>
		`${countdown(gameDate).toString()} till the Nucks play next`,
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

async function getGameFromNhlApi() {
	const today = dateFormat(new Date(), strings.dateFormat)
	const sixMonthsFromNow = dateFormat(
		addMonths(new Date(), 6),
		strings.dateFormat
	)
	const {
		data: { dates },
	} = await axios(
		`https://statsapi.web.nhl.com/api/v1/schedule?startDate=${today}&endDate=${sixMonthsFromNow}&teamId=23`
	)

	const game = dates.length === 0 ? null : getNextGame(dates)
	idbKeyval.set('game', game)
	return game
}

class NucksCountdownContainer extends Component {
	state = { loading: true, game: null, now: new Date() }
	async componentDidMount() {
		let game = await idbKeyval.get('game')

		if (game) {
			this.setState({ loading: false, game })
		}

		getGameFromNhlApi().then((game) => {
			setTimeout(() => {
				this.setState({ loading: false, game })
			}, 1000)
		})

		this.intervalHandle = setInterval(() => {
			this.setState({ now: new Date() })
		}, 1000)
	}
	render() {
		const { loading, game } = this.state
		return loading || <NucksCountdown game={game} />
	}
	componentWillUnmount() {
		clearInterval(this.intervalHandle)
	}
}

function NucksCountdown({ game }) {
	const { status: { abstractGameState } = {} } = game || {}
	let { gameDate, teams } = game || {}

	gameDate = gameDate && new Date(gameDate)

	const countdownString = !game
		? strings.noGame
		: abstractGameState === 'Live'
		? strings.live
		: abstractGameState === 'Preview' && isPast(gameDate)
		? strings.puckDrop
		: strings.countdown(gameDate)

	const opposingTeamName = getOpposingTeamName(teams)

	return (
		<div className="App">
			<div
				className="logo"
				style={{ width: '256px', height: 'auto', margin: 'auto' }}
			>
				<Logo />
			</div>
			<div className="countdown">{countdownString}</div>
			{gameDate && (
				<div className="date">{dateFormat(gameDate, 'ddd MMM D, h:mm A')}</div>
			)}
			{opposingTeamName && (
				<div className="opponent">vs {opposingTeamName}</div>
			)}
		</div>
	)
}

export default NucksCountdownContainer
