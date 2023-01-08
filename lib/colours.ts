export type TeamColour = {
	primary: string
	secondary: string
}

type Colours = Record<string, TeamColour>

export const colours: Colours = {
	njd: {
		primary: '#010101',
		secondary: '#C7102E',
	},
	nyi: {
		primary: '#003087',
		secondary: '#FC4C01',
	},
	nyr: {
		primary: '#0133A0',
		secondary: '#C7102E',
	},
	phi: {
		primary: '#010101',
		secondary: '#FA4616',
	},
	pit: {
		primary: '#010101',
		secondary: '#FEB81D',
	},
	bos: {
		primary: '#010101',
		secondary: '#FEB81D',
	},
	buf: {
		primary: '#003087',
		secondary: '#FEB81D',
	},
	mtl: {
		primary: '#011E62',
		secondary: '#A5192E',
	},
	ott: {
		primary: '#010101',
		secondary: '#C7102E',
	},
	tor: {
		primary: '#00205A',
		secondary: '#FFFFFF',
	},
	car: {
		primary: '#010101',
		secondary: '#C7102E',
	},
	fla: {
		primary: '#041E42',
		secondary: '#C7102E',
	},
	tbl: {
		primary: '#002868',
		secondary: '#FFFFFF',
	},
	wsh: {
		primary: '#C7102E',
		secondary: '#041E42',
	},
	chi: {
		primary: '#010101',
		secondary: '#C7102E',
	},
	det: {
		primary: '#C7102E',
		secondary: '#FFFFFF',
	},
	nsh: {
		primary: '#041E42',
		secondary: '#FEB81D',
	},
	stl: {
		primary: '#041E42',
		secondary: '#FEB81D',
	},
	cgy: {
		primary: '#C7102E',
		secondary: '#F1BE48',
	},
	col: {
		primary: '#6E263D',
		secondary: '#236192',
	},
	edm: {
		// Lighter colour (orange) is primary
		primary: '#CE4520',
		secondary: '#00205A',
	},
	van: {
		primary: '#00205B',
		secondary: '#00843D',
	},
	ana: {
		primary: '#000',
		secondary: '#B9975B',
	},
	dal: {
		primary: '#000000',
		secondary: '#006847',
	},
	lak: {
		primary: '#000000',
		secondary: '#A2AAAD',
	},
	sjs: {
		primary: '#006D75',
		secondary: '#000000',
	},
	cbj: {
		primary: '#002654',
		secondary: '#CE1126',
	},
	min: {
		primary: '#154734',
		secondary: '#A6192E',
	},
	wpg: {
		primary: '#041E42',
		secondary: '#7B303E',
	},
	ari: {
		// lighter colour (maroon) is primary
		primary: '#8C2633',
		secondary: '#111111',
	},
	vgk: {
		primary: '#000',
		secondary: '#B4975A',
	},
	sea: {
		primary: '#001628',
		secondary: '#99D9D9',
	},
}
