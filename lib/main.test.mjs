import { describe, it, expect } from 'vitest';
import { getReadTime } from './main.js';

describe('getReadTime', () => {
	it('should return 0 when text is empty', () => {
		expect(getReadTime('', {})).toBe(0);
	});

	it('should calculate read time correctly with default options', () => {
		const text = 'This is a sample text to read.';
		const options = { wordsPerMinute: 200 };
		const expected = (text.split(' ').length / options.wordsPerMinute) * 60;
		expect(getReadTime(text, options)).toBe(expected);
	});

	it('should handle custom words per minute', () => {
		const text = 'Another test case with different speed.';
		const options = { wordsPerMinute: 300 };
		const expected = (text.split(' ').length / options.wordsPerMinute) * 60;
		expect(getReadTime(text, options)).toBe(expected);
	});

	it('should return 0 for null or undefined text', () => {
		expect(getReadTime(null, {})).toBe(0);
		expect(getReadTime(undefined, {})).toBe(0);
	});

	it('should handle non-string text input gracefully', () => {
		expect(getReadTime(12345, {})).toBe(0);
	});
});
