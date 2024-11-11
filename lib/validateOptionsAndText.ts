import { z } from 'zod';

export const optionsSchema = z.object({
	standardDeviationOffset: z.number().default(0),
	language: z.string().default('en'),
	wordBound: z.function(z.tuple([z.string()]), z.number()).optional(),
});

export const contentSchema = z
	.string()
	// Remove HTML tags
	.transform((value) => value.replaceAll(/<[^>]+>/g, ' '))
	// Remove encoded characters, shamelessly copied from https://github.com/mdevils/html-entities/blob/33d4acf0294d76032ca131dccccdd9520772aea6/src/index.ts#L97
	.transform((value) =>
		value.replaceAll(/&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+)[;=]?/g, '')
	);

export type Options = z.infer<typeof optionsSchema>;

export function validateOptionsAndText(options: unknown, text: unknown) {
	const parsedOptions = optionsSchema.safeParse(options);
	if (!parsedOptions.success) {
		throw new Error('Invalid options');
	}

	const parsedText = contentSchema.safeParse(text);
	if (!parsedText.success) {
		throw new Error('Invalid text');
	}

	return { __options: parsedOptions.data, __text: parsedText.data };
}
