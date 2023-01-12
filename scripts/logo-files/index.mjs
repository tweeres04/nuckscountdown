import fetch from 'node-fetch'
import { readFile, writeFile } from 'node:fs/promises'

async function go() {
	const teamsPromise = fetch('https://statsapi.web.nhl.com/api/v1/teams').then(
		(r) => r.json()
	)
	const data = await readFile('logos.svg', 'utf8')

	let matches = data.matchAll(/<symbol(.|\n)+?>(?<markup>(.|\n)+?)<\/symbol>/g)

	matches = [...matches]

	const promises = matches.map(async (match) => {
		const { teams } = await teamsPromise
		const results_ = match[0].match(/team-(?<id>\d{1,2})-20222023-dark/)
		if (!results_) {
			return
		}
		const { id } = results_.groups

		const team = teams.find((t) => t.id == id)

		if (!team) {
			return
		}

		const { markup } = match.groups

		const svgOutput = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640">
	${markup}
</svg>
		`

		return writeFile(
			`output/${team.abbreviation.toLowerCase()}.svg`,
			svgOutput,
			'utf8'
		)
	})

	await Promise.all(promises)

	console.log('Done')
}

go()
