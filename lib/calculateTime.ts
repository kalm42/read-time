import speeds from './languageSpeeds';

export function calculateTime(
	wordCount: number,
	language: string,
	adjustment: number
) {
	if (wordCount < 1) return 0;

	const bestLanguageFit = Intl.Segmenter.supportedLocalesOf(language)[0];

	const speedStats = speeds[bestLanguageFit] || speeds.default;

	let offset = adjustment * speedStats.standardDeviation;
	if (offset === 1) offset = 0;

	const millisecondsPerWord = speedStats.mean + offset;

	const time = Math.round(wordCount * millisecondsPerWord);
	return time;
}
