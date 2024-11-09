import { describe, expect, it } from 'vitest';
import { calculateTime } from './calculateTime.mjs';
import speeds from './languageSpeeds.mjs';

describe('calculateTime', () => {
	it('should calculate time correctly with known language and adjustment', () => {
		const wordCount = 100;
		const language = 'en';
		const adjustment = 0;
		const expected = wordCount * speeds[language].mean * (adjustment + 1);
		expect(calculateTime(wordCount, language, adjustment)).toBe(expected);
	});

	it('should use default speedStats when language is unknown', () => {
		const wordCount = 50;
		const language = 'unknown';
		const adjustment = 1;
		const expected =
			wordCount *
			(speeds.default.mean + adjustment * speeds.default.standardDeviation);
		expect(calculateTime(wordCount, language, adjustment)).toBe(expected);
	});

	it('should handle adjustment correctly', () => {
		const wordCount = 200;
		const language = 'en';
		const adjustment = 2;
		const expected =
			wordCount *
			(speeds[language].mean + adjustment * speeds[language].standardDeviation);
		expect(calculateTime(wordCount, language, adjustment)).toBe(expected);
	});

	it('should return 0 when wordCount is 0', () => {
		const wordCount = 0;
		const language = 'en';
		const adjustment = 1;
		const expected = 0;
		expect(calculateTime(wordCount, language, adjustment)).toBe(expected);
	});
});
