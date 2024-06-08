<script setup
		lang="ts">

			definePageMeta
				({
					middleware
						: ["auth"]
					// or middleware: 'auth'
				})

			import type { Tables } from "~/types/supabase.type";
			import { Icon } from '@iconify/vue'

			type UserDataType = Tables<"users">;
			type RouteDataType = Tables<"routes">;

			// type RouteAquiredDataType = {
			// 	id: number;
			// 	RID: number;
			// 	route_color: string;
			// 	route_date: string;
			// 	route_grade: number;
			// 	route_link: string;
			// 	route_setter: string;
			// 	URID: string;
			// 	zone_name: string;
			// };

			type RouteTabsDataType = Array<{
				zone: "Moon Korner" | "Slabber" | "High Tension" | "Da Ruff" | "Flat Door" | "Titanic" | "Hang Over Corner" | "Bob Your Uncle" | "Circle of Life";
				tabName: "MK" | "SL" | "HT" | "DR" | "FD" | "TI" | "HOC" | "BYU" | "COL";
				cardDescription: string;
				routes: RouteDataType[]
			}>;

			const routeTabs = ref<RouteTabsDataType>([
				{
					zone: "Moon Korner",
					tabName: "MK",
					cardDescription: "First zone on your left! Next to the moonboard.",
					routes: []
				},
				{
					zone: "Slabber",
					tabName: "SL",
					cardDescription: "Second zone on your left! Next to the Moon Korner.",
					routes: []
				},
				{
					zone: "High Tension",
					tabName: "HT",
					cardDescription: "Third zone on your left! Right befor the roof.",
					routes: []
				},
				{
					zone: "Da Ruff",
					tabName: "DR",
					cardDescription: "Right in front of you! The big roof is waiting for you.",
					routes: []
				},
				{
					zone: "Flat Door",
					tabName: "FD",
					cardDescription: "Right next to the big roof, emergency door is on it's right.",
					routes: []
				},
				{
					zone: "Titanic",
					tabName: "TI",
					cardDescription: "On your right, the part that looks like a boat, could you had guessed?.",
					routes: []
				},
				{
					zone: "Hang Over Corner",
					tabName: "HOC",
					cardDescription: "On the right, hidden by the big bob.",
					routes: []
				},
				{
					zone: "Bob Your Uncle",
					tabName: "BYU",
					cardDescription: "The big bob on your right pops out of the wall.",
					routes: []
				},
				{
					zone: "Circle of Life",
					tabName: "COL",
					cardDescription: "On your right, to first climb or bring your kid to try.",
					routes: []
				},
			]);

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

				routeTabs.value.map((tab) => {
					tab.routes.push(
						...routeList.value.filter((route) => route.zone_name === tab.zone)
					)
				});
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
				<Tabs default-value="Moon Korner" class="w-full">
					<TabsList class="grid w-full grid-cols-9">
						<TabsTrigger v-for="tab in routeTabs" :value="tab.zone">
							{{ tab.tabName }}
						</TabsTrigger>
					</TabsList>
					<TabsContent v-for="tab in routeTabs" :value="tab.zone">
						<Card>
							<CardHeader>
								<CardTitle>{{ tab.zone }}</CardTitle>
								<CardDescription>
									{{ tab.cardDescription }}
								</CardDescription>
							</CardHeader>
							<Table class="w-full">
								<TableHeader>
									<TableRow>
										<TableHead class="text-foreground font-bold text-base">
											Route List - Route Number: {{ tab.routes.length }}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow v-for="row in tab.routes" class="flex flex-row justify-between">
										<TableCell class="flex flex-col px-2 py-3 gap-1 justify-center">
											<div class="px-2 py-1 font-bold text-sm"
												:class="`bg-${row.route_color?.toString()} text-${row.route_color?.toString()}-foreground rounded-full`">
												{{ row.zone_name }} - {{ row.route_color?.toUpperCase() }}
											</div>
											<div class="text-xs italic pl-2">
												Set by: <span class="capitalize">{{ row.route_setter }}</span>
											</div>
										</TableCell>
										<TableCell class="flex flex-row px-2 py-3 gap-1 items-center">
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
						</Card>
					</TabsContent>
				</Tabs>
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
