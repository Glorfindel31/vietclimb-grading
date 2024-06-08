<script setup
		lang="ts">

			definePageMeta
				({
					middleware
						: ["auth"]
					// or middleware: 'auth'
				})

			import type { Tables } from "~/types/supabase.type";
			import { columnsUser } from "~/components/tableGradUsers/columns";
			import { Icon } from '@iconify/vue'

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
				<Table class=" w-full">
					<TableHeader>
						<TableRow>
							<TableHead class="text-foreground font-bold text-base">
								Route List - Route Number: {{ routeList.length }}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow v-for="row in routeList" class="flex flex-row justify-between">
							<TableCell class="flex flex-col p-0 py-3 gap-1 justify-center">
								<div class="px-2 py-1 font-bold text-sm"
									:class="`bg-${row.route_color?.toString()} text-${row.route_color?.toString()}-foreground rounded-full`">
									{{ row.zone_name }} - {{ row.route_color?.toUpperCase() }}
								</div>
								<div class="text-xs italic pl-2">
									Set by: <span class="capitalize">{{ row.route_setter }}</span>
								</div>
							</TableCell>
							<TableCell class="flex flex-row p-0 py-3 gap-2 items-center">
								<div class="flex flex-col gap-1">
									<div>
										Grade: {{ row.route_grade }}
									</div>
									<div class="text-xs italic flex flex-row gap-1 items-center">
										Rate:
										<div class="flex flex-row gap-0">
											<Icon icon="radix-icons:star-filled" class="h-3 w-3" />
											<Icon icon="radix-icons:star-filled" class="h-3 w-3" />
											<Icon icon="radix-icons:star-filled" class="h-3 w-3" />
											<Icon icon="radix-icons:star-filled" class="h-3 w-3" />
											<Icon icon="radix-icons:star-filled" class="h-3 w-3" />
										</div>
									</div>
								</div>
								<Button variant="outline" size="icon">
									<Icon icon="radix-icons:plus" class="h-5 w-5" />
								</Button>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
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
