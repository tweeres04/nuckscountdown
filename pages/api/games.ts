import { NextApiRequest, NextApiResponse } from 'next'
import { format as dateFormat } from 'date-fns'
import * as Sentry from '@sentry/nextjs'

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

	const json = await response.json()

	res.json(json)
}
