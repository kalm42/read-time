type Speed = {
	[key: string]: {
		mean: number;
		standardDeviation: number;
	};
};

const speeds: Speed = {
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
		mean: 303,
		standardDeviation: 71,
	},
};
export default speeds;
