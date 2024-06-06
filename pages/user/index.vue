<script setup
		lang="ts">

			import { Icon } from "@iconify/vue/dist/iconify.js";
			import type { Tables } from "~/types/supabase.type";
			type UserDataType = Tables<"users">;


			const { data } = await useAsyncData(
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
	<div class="flex flex-col justify-center p-4" v-if="userData">
		<div class="flex-col flex min-h-[80vh] max-w-[1400px] gap-4 rounded-lg border bg-background p-4">
			<div class="">
				<div class="flex w-full flex-row items-center justify-between border-b py-4">
					<h1 class="text-3xl">Welcome <span class="capitalize text-primary italic">
							{{ userData.displayed_name }}
						</span> in your personal space</h1>
					<Button size="icon" variant="ghost" asChild>
						<NuxtLink to="/user/settings">
							<Icon icon="radix-icons:gear" class="h-6 w-6" />
						</NuxtLink>
					</Button>
				</div>
				<p class="text-sm italic">
					Log your accents, rate the routes and give a rate to the route you
					climbed.
				</p>
			</div>
			<div class="">
				<h2 class="text-md">Route Table</h2>
			</div>
			<div class="">
				<h2 class="text-md">Your Stats</h2>
			</div>
		</div>
	</div>
	<div v-else>
		<p>Something went wrong...</p>
	</div>
</template>

<style scoped></style>
