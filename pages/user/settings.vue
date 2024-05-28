<script setup
		lang="ts">
			import { Icon } from "@iconify/vue/dist/iconify.js";
</script>

<template>
	<div class="flex flex-col justify-center p-4">
		<div class="fle-col flex min-h-[80vh] max-w-[1400px] flex-col gap-4 rounded-lg border bg-background p-4">
			<div class="">
				<div class="flex w-full flex-row items-center justify-between border-b py-4">
					<h1 class="text-3xl">Configuration and Settings</h1>
					<Button size="icon" variant="ghost" asChild>
						<NuxtLink to="/user">
							<Icon icon="radix-icons:chevron-left" class="h-6 w-6" />
						</NuxtLink>
					</Button>
				</div>
				<p class="text-sm italic">
					Your data is yours, you are free to show it to the world or keep it!
				</p>
			</div>

		</div>
	</div>
</template>

<style scoped></style>