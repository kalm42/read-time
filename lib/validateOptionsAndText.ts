import { z } from 'zod';

const optionsSchema = z.object({
	standardDeviationOffset: z.number().default(0),
	language: z.string().default('en'),
	wordBound: z.function(z.tuple([z.string()]), z.number()).optional(),
});

export type Options = z.infer<typeof optionsSchema>;

export function validateOptionsAndText(options: unknown, text: unknown) {
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
