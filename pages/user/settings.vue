<script setup
		lang="ts">
			import { Icon } from "@iconify/vue/dist/iconify.js";

			const user = useSupabaseUser();
			const supabase = useSupabaseClient();

</script>

<template>
	<div class="flex flex-col items-center justify-between w-full">
		<div class="max-w-[1400px] items-center justify-between p-2 sm:p-4 md:p-8">
			<div class="flex w-full flex-row items-center justify-between  py-8">
				<h1 class="text-2xl">Configuration and Settings</h1>
				<Button size="icon" variant="ghost" asChild>
					<NuxtLink to="/user">
						<Icon icon="radix-icons:chevron-left" class="h-6 w-6" />
					</NuxtLink>
				</Button>
			</div>
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<GeneralSettings />
				<PrivacySettings />
			</div>
		</div>
	</div>
</template>

<style scoped></style>