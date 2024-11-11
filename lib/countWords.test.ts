import { describe, expect, it } from 'vitest';
import { countWords } from './countWords';

describe('countWords', () => {
	it('should return word count using wordBound function', () => {
		const text = 'Hello world!';
		const wordBound = (txt) => txt.split(' ').length;
		expect(countWords(text, 'en', wordBound)).toBe(2);
	});

	it('should return word count using Intl.Segmenter when wordBound is not provided', () => {
		const text = 'Hello world!';
		const language = 'en';
		// Mock Intl.Segmenter
		// @ts-ignore - Mocking global object
		global.Intl.Segmenter = class {
			constructor(lang, options) {}
			segment(txt) {
				return [
					{ isWordLike: true, segment: 'Hello' },
					{ isWordLike: true, segment: 'world!' },
				];
			}
		};
		expect(countWords(text, language)).toBe(2);
	});

	it('should return word count by splitting spaces when Intl.Segmenter is not available', () => {
		const text = 'Hello world !';
		const language = 'en';
		// Remove Intl.Segmenter
		// @ts-ignore - Mocking global object
		delete global.Intl.Segmenter;
		expect(countWords(text, language)).toBe(3);
	});

	it('should return 0 for empty string', () => {
		const text = '';
		expect(countWords(text, 'en')).toBe(0);
	});

	it('should return 0 for null text', () => {
		const text = null;
		// @ts-expect-error - Testing invalid input
		expect(countWords(text, 'en')).toBe(0);
	});
});
