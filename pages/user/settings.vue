<script setup
		lang="ts">
			import { Icon } from "@iconify/vue/dist/iconify.js";

			import type { Tables } from "~/types/supabase.type";
			type UserDataType = Tables<"users">;

			const { data, refresh } = await useAsyncData(
				"userData",
				async () => {
					const user = useSupabaseUser();
					const supabase = useSupabaseClient();
					if (!user.value) return;
					const { data: userData, error } = await supabase
						.from("users")
						.select("*")
						.eq("UID", user.value.id)
					if (error) {
						console.error(error)
						return
					}
					return userData[0]
				}
			)

			const userData = ref<UserDataType | null>(null)
			if (data.value) {
				userData.value = data.value
			}

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
				<GeneralSettings :userData="userData" :refresh="refresh" />
				<PrivacySettings :userData="userData" :refresh="refresh" />
			</div>
		</div>
	</div>
</template>

<style scoped></style>