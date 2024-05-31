<script setup
		lang="ts">
			import { Icon } from "@iconify/vue/dist/iconify.js";
</script>

<template>
	<div class="flex flex-col justify-center p-2 sm:p-10">
		<div class="flex w-full flex-row items-center justify-between max-w-[1400px] pb-8">
			<h1 class="text-2xl">Configuration and Settings</h1>
			<Button size="icon" variant="ghost" asChild>
				<NuxtLink to="/user">
					<Icon icon="radix-icons:chevron-left" class="h-6 w-6" />
				</NuxtLink>
			</Button>
		</div>
		<div class="flex flex-col lg:flex-row gap-4">
			<GeneralSettings />
			<PrivacySettings />
		</div>
	</div>
</template>

<style scoped></style>