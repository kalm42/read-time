import { z } from 'zod';

export function countWords(text, language, wordBound) {
	if (!z.string().safeParse(text).success || !text) return 0;

	if (wordBound) {
		return wordBound(text);
	}

	if (!Intl.Segmenter) {
		return text.split(' ').length;
	}

	const segmenter = new Intl.Segmenter(language, {
		localeMatcher: 'best fit',
		granularity: 'word',
	});

	const words = [...segmenter.segment(text)].filter((seg) => seg.isWordLike);

	return words.length;
}
