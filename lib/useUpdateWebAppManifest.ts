import { useEffect } from 'react'

/**
 * When using client side routing, the manifest can be out of date. Update it on every page load to make sure users install the correct app.
 */
export function useUpdateWebAppManifest(teamAbbreviation: string) {
	useEffect(() => {
		const linkElement = document.getElementById(
			'webAppManifestLink'
		) as HTMLLinkElement
		linkElement.href = `/api/manifest/${teamAbbreviation.toLowerCase()}`
	}, [teamAbbreviation])
}
