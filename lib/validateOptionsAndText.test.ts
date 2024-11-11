import { describe, expect, it } from 'vitest';
import { validateOptionsAndText } from './validateOptionsAndText';

describe('validateOptionsAndText', () => {
	it('should return text and options object', () => {
		const options = {
			standardDeviationOffset: 2,
			language: 'fr',
			wordBound: () => {},
		};
		const text = 'Sample text';
		const result = validateOptionsAndText(options, text);
		expect(result.__options.standardDeviationOffset).toBe(2);
		expect(result.__options.language).toBe('fr');
		expect(typeof result.__options.wordBound).toBe('function');
	});

	it('should apply defaults when options are missing', () => {
		const options = {};
		const text = 'Sample text';
		const result = validateOptionsAndText(options, text);
		expect(result.__options.standardDeviationOffset).toBe(0);
		expect(result.__options.language).toBe('en');
		expect(result.__options.wordBound).toBeUndefined();
	});

	it('should throw error for invalid standardDeviationOffset', () => {
		const options = { standardDeviationOffset: 'invalid', language: 'en' };
		const text = 'Sample text';
		expect(() => validateOptionsAndText(options, text)).toThrow(
			'Invalid options'
		);
	});

	it('should throw error for invalid language type', () => {
		const options = { standardDeviationOffset: 1, language: 123 };
		const text = 'Sample text';
		expect(() => validateOptionsAndText(options, text)).toThrow(
			'Invalid options'
		);
	});

	it('should throw error for invalid wordBound type', () => {
		const options = {
			standardDeviationOffset: 1,
			language: 'en',
			wordBound: 'not a function',
		};
		const text = 'Sample text';
		expect(() => validateOptionsAndText(options, text)).toThrow(
			'Invalid options'
		);
	});

	it('ignores unknown additional properties', () => {
		const options = {
			standardDeviationOffset: 1,
			language: 'en',
			extraProp: 'extra',
		};
		const text = 'Sample text';
		const result = validateOptionsAndText(options, text);
		// @ts-expect-error
		expect(result.__options.extraProp).toBeUndefined();
	});
});
