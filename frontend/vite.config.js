import { sveltekit } from '@sveltejs/kit/vite';
import VitePluginBrowserSync from 'vite-plugin-browser-sync'

const config = {
	plugins: [sveltekit(),
		VitePluginBrowserSync()]
};

export default config;
