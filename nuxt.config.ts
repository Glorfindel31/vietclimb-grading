// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	colorMode: {
		classSuffix: "",
	},
	modules: [
		"@nuxtjs/tailwindcss",
		"shadcn-nuxt",
		"@nuxtjs/color-mode",
		"@nuxt/image",
		"@nuxtjs/supabase",
	],
	supabase: {
		redirect: false,
	},
	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: "",
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: "./components/ui",
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
