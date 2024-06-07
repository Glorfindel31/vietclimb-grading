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
			import { columnsUser } from "~/components/tableGradUsers/columns";

			type UserDataType = Tables<"users">;
			type RouteDataType = Tables<"routes">;

			const { data } = await useAsyncData("userData", async () => {
				const user = useSupabaseUser();
				const supabase = useSupabaseClient();

				if (!user.value) return;
				const { data: userData, error: errorUser } = await supabase
					.from("users")
					.select("*")
					.eq("UID", user.value.id);
				if (errorUser) {
					console.error(errorUser);
					return;
				}
				if (!user.value) return;
				const { data: routeList, error: errorRoutes } = await supabase
					.from("routes")
					.select("*")
				if (errorRoutes) {
					console.error(errorRoutes);
					return;
				}

				return { userData: userData[0], routeList: routeList }
			});

			const userData = ref<UserDataType | null>(null);
			const routeList = ref<RouteDataType[]>([]);

			if (data.value) {
				userData.value = data.value.userData;
				routeList.value = data.value.routeList;

				routeList.value = routeList.value
					.sort((a, b) => a.id - b.id)
					.filter((route) => route.route_grade);
			}



</script>

<template>
	<div class="page-container" v-if="userData">
		<div class="page-card sm:rounded-lg bg-background sm:border sm:shadow-lg">
			<div class="">
				<div class="flex w-full flex-row items-center justify-between border-b py-4">
					<h1 class="text-3xl">
						Welcome
						<span class="capitalize italic text-primary">
							{{ userData.displayed_name }}
						</span>
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
				<TableGradUsersDataTable :columns="columnsUser" :data="routeList" />
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
