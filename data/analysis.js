const path = require('path');
const fs = require('fs/promises');

async function calculateReadTime() {
	const records = JSON.parse(
		await fs.readFile(path.join(__dirname, './InfoRateData.json'), 'utf-8')
	);
	const languageStats = {};
	const finalStats = {};

	for (const record of records) {
		// Pull data from the record
		const language = record.Language;
		const passage = record.Text;
		const time = Math.floor(record.Duration * 1_000); // Convert seconds to milliseconds

		// Is the language in the list?
		if (!languageStats[language]) {
			languageStats[language] = {};
		}

		// Is the passage in the list?
		if (!languageStats[language][passage]) {
			languageStats[language][passage] = {
				wordCount: 0,
				fastest: Infinity,
				slowest: 0,
				mean: 0,
				median: 0,
				timeEntries: [],
				millisecondsPerWord: [],
				count: 0,
			};
		}

		const stat = languageStats[language][passage];
		// Update language stats
		// Set word count if needed
		if (stat.wordCount === 0) {
			// Load the text
			const filename = `./texts/${passage.toLowerCase()}_${language.toLowerCase()}.txt`;
			const text = await fs.readFile(path.join(__dirname, filename), 'utf-8');

			// Get the word count
			const wordCount = countWords(text, language);
			stat.wordCount = wordCount;
		}
		// Fastest
		stat.fastest = time < stat.fastest ? time : stat.fastest;
		// Slowest
		stat.slowest = time > stat.slowest ? time : stat.slowest;
		// Count
		stat.count++;
		// Update the entries
		stat.timeEntries.push(time);
		// Update the mean
		stat.mean = Math.floor(
			stat.timeEntries.reduce((a, b) => a + b, 0) / stat.count
		);
		// Update the median
		stat.timeEntries.sort((a, b) => a - b);
		const mid = Math.floor(stat.count / 2);
		stat.median =
			stat.count % 2 !== 0
				? stat.timeEntries[mid]
				: Math.floor((stat.timeEntries[mid - 1] + stat.timeEntries[mid]) / 2);
		// Update the milliseconds per word
		stat.millisecondsPerWord.push(Math.round(time / stat.wordCount));
	}

	// Calculate the overall stats for each language
	for (const language in languageStats) {
		// All stats are of milliseconds per word
		const stats = {
			mean: 0,
			median: 0,
			standardDeviation: 0,
			locale: getLocale(language),
		};
		const mpw = [];
		const selectedLanguageStats = languageStats[language];
		for (const passage in selectedLanguageStats) {
			if (
				Object.prototype.hasOwnProperty.call(selectedLanguageStats, passage)
			) {
				const passageStats = selectedLanguageStats[passage];
				mpw.push(...passageStats.millisecondsPerWord);
			}
		}
		// Calculate the mean
		stats.mean = Math.floor(mpw.reduce((a, b) => a + b, 0) / mpw.length);
		// Calculate the median
		stats.median =
			mpw.length % 2 !== 0
				? mpw[Math.floor(mpw.length / 2)]
				: Math.floor(
						(mpw[Math.floor(mpw.length / 2) - 1] +
							mpw[Math.floor(mpw.length / 2)]) /
							2
				  );
		// Calculate the standard deviation
		const mean = stats.mean;
		const squaredDiffs = mpw.map((x) => (x - mean) ** 2);
		const variance = squaredDiffs.reduce((a, b) => a + b, 0) / mpw.length; // Population variance
		stats.standardDeviation = Math.round(Math.sqrt(variance));
		finalStats[language] = stats;
		languageStats[language].overall = stats;
	}

	// Write the results to a file
	await fs.writeFile(
		path.join(__dirname, './read-time-stats.json'),
		JSON.stringify(finalStats, null, 2)
	);
}

function countWords(text, language) {
	if (!Intl.Segmenter) {
		return text.split(' ').length;
	}

	const options = { localeMatcher: 'lookup', granularity: 'word' };
	const segmenter = new Intl.Segmenter(getLocale(language), options);
	const words = [...segmenter.segment(text)].filter((seg) => seg.isWordLike);
	return words.length;
}

function getLocale(language) {
	const foo = Intl.Segmenter.supportedLocalesOf([language], {
		localeMatcher: 'lookup',
		granularity: 'string',
	});
	if (foo.length === 1) {
		return foo[0];
	}
	return 'en';
}

calculateReadTime();
