import getOpposingTeamName from './getOpposingTeamName';

test('getOpposingTeamName', () => {
	const teams = {
		home: {
			team: {
				name: 'Vancouver Canucks'
			}
		},
		away: {
			team: {
				name: 'Opposing Team'
			}
		}
	};

	const actual = getOpposingTeamName(teams);
	const expected = 'Opposing Team';

	expect(actual).toEqual(expected);
});

test('falsy values', () => {
	let teams = {};
	let actual = getOpposingTeamName(teams);

	expect(actual).toBeFalsy();

	teams = null;
	actual = getOpposingTeamName(teams);

	expect(actual).toBeFalsy();
});
