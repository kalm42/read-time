const path = require('path');
const { defineConfig } = require('vite');

module.exports = defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'lib/main.js'),
			name: 'read-time',
			fileName: (format) => `read-time.${format}.js`,
		},
	},
});
