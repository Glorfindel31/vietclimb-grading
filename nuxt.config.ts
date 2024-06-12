import { Video } from 'lucide-vue-next';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: false },
	colorMode: {
		classSuffix: "",
	},
	modules: [
		"@nuxtjs/color-mode",
		"@nuxt/image",
		"@nuxtjs/supabase",
		"@nuxtjs/tailwindcss",
		"shadcn-nuxt"
	],
	supabase: {
		url: process.env.SUPABASE_URL,
		key: process.env.SUPABASE_KEY,
		redirectOptions: {
			login: "/login",
			exclude: ["/", "/login", "/register", "/about", "/public"],
			callback: "/user",
		},
		redirect: true,
	},
	runtimeConfig: {
		public: {
			admin: process.env.ADMIN_ID,
		}
	},
	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: '',
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: './components/ui'
	},
	image: {
		domains: ["utfs.io"],
	},
	app: {
		head: {
			meta: [
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
			],
			script: [
				{
					src: "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js",
				},
			],
			noscript: [
				// <noscript>JavaScript is required</noscript>
				{ children: "JavaScript is required" },
			],
		},
	},
});