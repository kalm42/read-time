import { z } from 'zod';
import { calculateTime } from './calculateTime';
import { countWords } from './countWords';
import { getReadTimeText } from './getReadTimeText';
import { Options, validateOptionsAndText } from './validateOptionsAndText';

export const readTimeResultSchema = z.object({
	text: z.string(),
	milliseconds: z.number(),
	seconds: z.number(),
	minutes: z.number(),
	words: z.number(),
});
export type ReadTimeResult = z.infer<typeof readTimeResultSchema>;
export type { Options };

/**
 * Calculates the time to read a given string.
 *
 * options = {
 *   standardDeviationOffset: 0, defaults to 0 as in no change, 1 for 1 standard deviation faster, -1 for 1 standard deviation slower etc.
 *   language: 'en', defaults to 'en' for English
 *   wordBound: (text: string) => number, optional user can provide a custom function for word boundary detection
 * }
 *
 */
export function getReadTime(
	text: string,
	options: Partial<Options> = {}
): ReadTimeResult {
	const { __options, __text } = validateOptionsAndText(options, text);

	const { standardDeviationOffset, language, wordBound } = __options;

	const words = countWords(__text, language, wordBound);

	const milliseconds = calculateTime(words, language, standardDeviationOffset);

	const seconds = Math.round(milliseconds / 1_000);
	const minutes = Math.round(milliseconds / 1_000 / 60);

	const humanized = getReadTimeText(minutes, language);

	return {
		text: humanized,
		milliseconds,
		seconds,
		minutes,
		words,
	};
}
