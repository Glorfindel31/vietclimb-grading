<script setup
		lang="ts">
			import type { NuxtError } from '#app'

			const props = defineProps({
				error: Object as () => NuxtError
			})

			const handleError = () => clearError({ redirect: '/', })
</script>

<template>
	<div v-if="error"
		class="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-t from-primary from-0% to-background to-50%">
		<div
			class="flex flex-col items-center justify-center gap-3 border px-36 py-20 rounded-lg shadow-lg bg-background">
			<h1 class="mb-4 text-9xl">{{ error.statusCode }}</h1>
			<p class="italic text-lg">Oupps...</p>
			<p>{{ error.statusMessage }}</p>
			<Button @click="handleError">Let's get you back home...</Button>
		</div>
	</div>
</template>
