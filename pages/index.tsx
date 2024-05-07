import { linearGradient } from '../lib/linearGradient'
import Head from 'next/head'
import Nav from '../lib/Nav'
import { Dispatch, SetStateAction, useRef, useState } from 'react'
import { teams } from '../lib/teams'
import { paramCase } from 'change-case'

function TeamDropdown({
	open,
	setOpen,
	closeDropdown,
	searchString,
	setSearchString,
}: {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
	closeDropdown: () => void
	searchString: string
	setSearchString: Dispatch<SetStateAction<string>>
}) {
	const inputRef = useRef<HTMLInputElement>(null)

	return (
		<div className={`dropdown${open ? ' is-active' : ''}`}>
			<div className="dropdown-trigger">
				<button
					className="button is-black is-large is-inverted"
					aria-haspopup="true"
					aria-controls="dropdown-menu"
					onClick={() => {
						if (!open) {
							setOpen((open) => !open)
							setTimeout(() => {
								inputRef.current?.focus()
							}, 0)
						} else {
							closeDropdown()
						}
					}}
				>
					<span>Pick your team</span>
					<span className="icon is-medium">
						{/* caret */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 448 512"
							fill="currentColor"
							style={{ height: '1em', width: '1em' }}
						>
							<path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
						</svg>
					</span>
				</button>
			</div>
			<div
				className="dropdown-menu"
				id="dropdown-menu"
				role="menu"
				onClick={(e) => {
					e.stopPropagation()
				}}
			>
				<div className="dropdown-content">
					<div className="dropdown-item">
						<p className="control has-icons-right">
							<input
								className="input is-small"
								onChange={(e) => {
									setSearchString(e.target.value)
								}}
								ref={inputRef}
								value={searchString}
							/>
							<span
								className="icon is-small is-right"
								style={{ display: 'flex', placeItems: 'center' }}
							>
								{/* magnifying glass */}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
									fill="currentColor"
									style={{ height: '1.5em', width: '1.5em' }}
								>
									<path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
								</svg>
							</span>
						</p>
					</div>
					{teams
						.filter((t) =>
							t.name.toLowerCase().includes(searchString.toLowerCase())
						)
						.map((t) => (
							<a
								href={`/${paramCase(t.teamName)}/countdown`}
								className="dropdown-item"
							>
								{t.name}
							</a>
						))}
				</div>
			</div>
		</div>
	)
}

export default function Index() {
	const [open, setOpen] = useState(false)
	const [searchString, setSearchString] = useState('')

	function closeDropdown() {
		setOpen(false)
		setSearchString('')
	}

	const teamColours = {
		primary: 'hsl(0, 0%, 4%)', // bulma is-black
		secondary: 'hsl(0, 0%, 98%)', // bulma footer
	}
	const heroClasses = `hero is-halfheight is-black`

	const title = 'When is the next NHL game? - NHL Countdown'
	const canonicalUrl = 'https://nhlcountdown.tweeres.ca'

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
			<Nav />
			<div
				className={heroClasses}
				style={{ background: linearGradient(teamColours) }}
				onClick={() => {
					if (open) {
						closeDropdown()
					}
				}}
			>
				<div className="hero-body">
					<div className="container">
						<div className="columns is-vcentered">
							<div className="column">
								<h1 className="title">Get pumped for your team's next game!</h1>
								<p className="subtitle">
									A fast, pretty web app that counts down to the next NHL game.
									Saves to your home screen for immediate access.
								</p>
								<TeamDropdown
									open={open}
									setOpen={setOpen}
									closeDropdown={closeDropdown}
									searchString={searchString}
									setSearchString={setSearchString}
								/>
							</div>
							<div className="column has-text-centered">
								<video
									width="326"
									height="706"
									src={`/hero/van.mp4`}
									className="hero-media"
									autoPlay
									playsInline
									muted
									loop
								>
									A video of Canucks Countdown in action
								</video>
								<p className="is-text-7 has-text-black">
									A clip of Canucks Countdown
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<footer className="footer">
				<div className="content has-text-centered">
					<div>NHL Countdown by</div>
					<div>
						<a href="https://tweeres.ca">Tyler Weeres</a>
					</div>
				</div>
			</footer>
		</>
	)
}
