import { calculateTime } from './calculateTime.mjs';
import { countWords } from './countWords.mjs';
import { getReadTimeText } from './getReadTimeText.mjs';
import { validateOptionsAndText } from './validateOptionsAndText.mjs';

/**
 * Calculates the time to read a given string.
 *
 * options = {
 *   standardDeviationOffset: 0, defaults to 0 as in no change, 1 for 1 standard deviation faster, -1 for 1 standard deviation slower etc.
 *   language: 'en', defaults to 'en' for English
 *   wordBound: (text: string) => number, optional user can provide a custom function for word boundary detection
 * }
 *
 * @param {string} text - The text to read.
 * @param {Object} options - Options for reading time calculation.
 * @returns {number} Time in seconds.
 */
function getReadTime(text, options) {
	const { __options, __text } = validateOptionsAndText(options, text);

	const { standardDeviationOffset, language, wordBound } = __options;

	const words = countWords(__text, language, wordBound);

	const milliseconds = calculateTime(words, language, standardDeviationOffset);

	const seconds = Math.floor(milliseconds / 1_000);
	const minutes = Math.floor(milliseconds / 1_000 / 60);

	const humanized = getReadTimeText(minutes, language);

	return {
		text: humanized,
		milliseconds,
		seconds,
		minutes,
		words,
	};
}

export default getReadTime;
