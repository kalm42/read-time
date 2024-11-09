const speeds = {
	ca: {
		mean: 264,
		standardDeviation: 30,
	},
	zh: {
		mean: 262,
		standardDeviation: 30,
	},
	de: {
		mean: 297,
		standardDeviation: 61,
	},
	en: {
		mean: 238,
		standardDeviation: 36,
	},
	eu: {
		mean: 380,
		standardDeviation: 46,
	},
	fi: {
		mean: 409,
		standardDeviation: 63,
	},
	fr: {
		mean: 227,
		standardDeviation: 28,
	},
	hu: {
		mean: 399,
		standardDeviation: 64,
	},
	it: {
		mean: 323,
		standardDeviation: 51,
	},
	ja: {
		mean: 231,
		standardDeviation: 24,
	},
	default: {
		mean: Math.round(
			[264, 262, 297, 238, 380, 409, 227, 399, 323, 231].reduce(
				(a, b) => a + b,
				0
			) / [264, 262, 297, 238, 380, 409, 227, 399, 323, 231].length
		),
		standardDeviation: Math.round(
			[30, 30, 61, 36, 46, 63, 28, 64, 51, 24].reduce((a, b) => a + b, 0) /
				[30, 30, 61, 36, 46, 63, 28, 64, 51, 24].length
		),
	},
};
export default speeds;
