import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import getReadTime from './main.mjs';
import fs from 'fs/promises';
import path from 'path';
import speeds from './languageSpeeds.mjs';

describe('getReadTime', () => {
	it('should return 0 when text is empty', () => {
		expect(getReadTime('', {})).toStrictEqual({
			milliseconds: 0,
			seconds: 0,
			minutes: 0,
			words: 0,
			text: '0 min read',
		});
	});

	it('should calculate read time correctly with default options', () => {
		const text = 'This is a sample text to read.';
		const options = {
			standardDeviationOffset: undefined,
			language: undefined,
			wordBound: undefined,
		};
		const expected = text.split(' ').length * (238 + 36 * 0);
		expect(getReadTime(text, options)).toStrictEqual({
			milliseconds: expected,
			seconds: expect.any(Number),
			minutes: expect.any(Number),
			words: 7,
			text: expect.any(String),
		});
	});

	it('should handle adjusting read speed', () => {
		const text = 'Another test case with different speed.';
		const options = {
			standardDeviationOffset: 1, // 1 standard deviation faster
			language: undefined,
			wordBound: undefined,
		};
		const expected = text.split(' ').length * (238 + 36 * 1);
		expect(getReadTime(text, options)).toStrictEqual({
			milliseconds: expected,
			seconds: expect.any(Number),
			minutes: expect.any(Number),
			words: 6,
			text: expect.any(String),
		});
	});

	it('should throw for null or undefined text', () => {
		expect(() => getReadTime(null, {})).toThrow();
		expect(() => getReadTime(undefined, {})).toThrow();
	});

	it('should throw an error if types are not followed', () => {
		expect(() => getReadTime(12345, 'options')).toThrow();
	});
});

describe('Read Time Estimation', async () => {
	const data = await fs.readFile(
		path.join(__dirname, '../data/InfoRateData.json'),
		'utf-8'
	);
	const records = JSON.parse(data).slice(0, 15);
	const texts = {};
	for (let index = 0; index < records.length; index++) {
		const record = records[index];
		const filename = `${record.Text.toLowerCase()}_${record.Language.toLowerCase()}`;
		if (texts[filename]) return;

		const data = await fs.readFile(
			path.join(__dirname, `../data/texts/${filename}.txt`),
			'utf-8'
		);
		texts[filename] = data;
	}

	for (let index = 0; index < records.length; index++) {
		const record = records[index];
		const text =
			texts[`${record.Text.toLowerCase()}_${record.Language.toLowerCase()}`];

		it('should calculate read time correctly', () => {
			const result = getReadTime(text, {
				standardDeviationOffset: undefined,
				language: record.Language,
				wordBound: undefined,
			});
			const getLanguage = Intl.Segmenter.supportedLocalesOf(record.Language)[0];
			const sd = speeds[getLanguage];

			const howFastTheReaderActuallyDid = record.Duration * 1_000; // convert to milliseconds

			const slowestAcceptable =
				(sd.mean - sd.standardDeviation * 3) * result.words;
			const fastestAcceptable =
				(sd.mean + sd.standardDeviation * 3) * result.words;

			expect(howFastTheReaderActuallyDid).lessThanOrEqual(fastestAcceptable);
			expect(howFastTheReaderActuallyDid).greaterThanOrEqual(slowestAcceptable);
		});
	}
});
