import { NextApiRequest, NextApiResponse } from 'next'
import { format as dateFormat } from 'date-fns'

const isoDateFormatString = 'yyyy-MM-dd'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const teamAbbrev = req.query.team
	const today = dateFormat(new Date(), isoDateFormatString)

	const response = await fetch(
		`https://api-web.nhle.com/v1/club-schedule/${teamAbbrev}/week/${today}`
	)

	if (!response.ok) {
		// to do log to sentry
		console.error(response)
	}

	const json = await response.json()

	return res.json(json)
}
