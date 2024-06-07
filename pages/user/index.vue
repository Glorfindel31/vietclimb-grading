<script setup
		lang="ts">

			definePageMeta
				({
					middleware
						: ["auth"]
					// or middleware: 'auth'
				})
			import { Icon } from "@iconify/vue/dist/iconify.js";
			import type { Tables } from "~/types/supabase.type";
			type UserDataType = Tables<"users">;

			const { data } = await useAsyncData("userData", async () => {
				const user = useSupabaseUser();
				const supabase = useSupabaseClient();
				if (!user.value) return;
				const { data: userData, error } = await supabase
					.from("users")
					.select("*")
					.eq("UID", user.value.id);
				if (error) {
					console.error(error);
					return;
				}
				return userData[0];
			});

			const userData = ref<UserDataType | null>(null);
			if (data.value) {
				userData.value = data.value;
			}
</script>

<template>
	<div class="page-container" v-if="userData">
		<div class="page-card rounded-lg sm:bg-background sm:border sm:shadow-lg">
			<div class="">
				<div class="flex w-full flex-row items-center justify-between border-b py-4">
					<h1 class="text-3xl">
						Welcome
						<span class="capitalize italic text-primary">
							{{ userData.displayed_name }}
						</span>
						in your personal space
					</h1>
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
		<div class="page-container">
			<div class="page-card border rounded-lg justify-center items-center">
				<h1>Something went wrong... 😵‍💫</h1>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
