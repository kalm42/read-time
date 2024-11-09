import { describe, expect, it } from 'vitest';
import { getReadTimeText } from './getReadTimeText.mjs';

describe('getReadTimeText', () => {
	it('should return correct translation for English', () => {
		expect(getReadTimeText(5, 'en')).toBe('5 min read');
	});

	it('should return correct translation for Spanish', () => {
		expect(getReadTimeText(3, 'ca')).toBe('3 min de lectura');
	});

	it('should return default translation for unsupported language', () => {
		expect(getReadTimeText(4, 'unknown')).toBe('4 min read');
	});

	it('should handle zero minutes correctly', () => {
		expect(getReadTimeText(0, 'en')).toBe('0 min read');
	});

	it('should handle non-integer minutes', () => {
		expect(getReadTimeText(2.5, 'en')).toBe('2.5 min read');
	});
});
