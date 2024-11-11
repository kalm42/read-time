import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'lib/main'),
			name: 'read-time',
			fileName: (format) => `read-time.${format}.js`,
		},
	},
});
