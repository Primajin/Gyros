import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: fileURLToPath(new URL('src/main.js', import.meta.url)),
			name: 'Gyros',
			fileName: format => `gyros.${format}.js`,
		},
	},
});
