// NOTE: spells out "reasonable"/common ♯/♭ enharmonics (eg, won't spell C/B♯, A/B𝄫 or B/A𝄪)
export function pitchclassName(pitchclass: number): string {
	return [
		/*  0 => */ 'C',
		/*  1 => */ 'C♯/D♭',
		/*  2 => */ 'D',
		/*  3 => */ 'D♯/E♭',
		/*  4 => */ 'E',
		/*  5 => */ 'F',
		/*  6 => */ 'F♯/G♭',
		/*  7 => */ 'G',
		/*  8 => */ 'G♯/A♭',
		/*  9 => */ 'A',
		/* 10 => */ 'A♯/B♭',
		/* 11 => */ 'B'
	][pitchclass]; // TODO error handling lol
}

export function modeName(mode: number): string {
	switch (mode) {
		case 0:
			return 'minor';
		case 1:
			return 'major';
		default:
			return 'undetermined';
	}
}
