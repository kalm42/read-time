import { z } from 'zod';

export function validateOptionsAndText(options, text) {
	const optionsSchema = z.object({
		standardDeviationOffset: z.number().default(0),
		language: z.string().default('en'),
		wordBound: z.function().optional(),
	});

	const parsedOptions = optionsSchema.safeParse(options);
	if (!parsedOptions.success) {
		throw new Error('Invalid options');
	}

	const parsedText = z.string().safeParse(text);
	if (!parsedText.success) {
		throw new Error('Invalid text');
	}
	return { __options: parsedOptions.data, __text: parsedText.data };
}
