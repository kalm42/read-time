import path from 'path';
import { defineConfig } from 'vite';
import ts2 from 'rollup-plugin-typescript2';

export default defineConfig({
	build: {
		outDir: 'dist',
		lib: {
			entry: path.resolve(__dirname, 'lib/index.ts'),
			name: 'read-time',
			formats: ['es', 'cjs', 'umd'],
			fileName: (format) =>
				format === 'cjs' ? `read-time.${format}` : `read-time.${format}.js`,
		},
	},
	plugins: [
		{
			...ts2({
				check: true,
				tsconfig: path.resolve(__dirname, 'tsconfig.json'),
				tsconfigOverride: {
					compilerOptions: {
						sourceMap: false,
						declarationMap: false,
					},
				},
			}),
			enforce: 'pre',
		},
	],
});
