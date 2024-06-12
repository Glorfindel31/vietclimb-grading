<script setup
		lang="ts">
			definePageMeta
				({
					middleware
						: ["auth"]
					// or middleware: 'auth'
				})
			import type { Database } from "~/types/supabase.type";
			import type {
				RouteTabsDataType,
				RouteWithTopRecords,
				UserWithTopRecords
			} from "@/types/userTable.type"
			import { Icon } from '@iconify/vue'
			import { useToast } from '@/components/ui/toast/use-toast'
			import { UserTableStructure } from "./UserTableStructure"

			const supabase = useSupabaseClient<Database>();
			const user = useSupabaseUser();

			const userData = ref<UserWithTopRecords | null>(null);
			const routeList = ref<RouteWithTopRecords[]>([]);
			const routeTabs = ref<RouteTabsDataType>(UserTableStructure);

			const { toast } = useToast()

			const { data, refresh } = await useAsyncData("userData", async () => {
				if (!user.value) return;
				const { data: userData, error: errorUser } = await supabase
					.from("users")
					.select("*,top_records (*)")
					.eq("UID", user.value.id);
				if (errorUser) {
					console.error(errorUser);
					return;
				}
				const { data: routeList, error: errorRoutes } = await supabase
					.from("routes")
					.select("*,top_records (*)")
				if (errorRoutes) {
					console.error(errorRoutes);
					return;
				}
				return { userData: userData[0], routeList: routeList }
			});

			watchEffect(() => {
				if (data.value && data.value.routeList) {
					userData.value = data.value.userData;

					const newRouteList = data.value.routeList
						.filter((route) => route.route_grade !== null)
						.sort((a, b) => a.id - b.id);

					const hasChanged = routeList.value.length !== newRouteList.length
						|| !routeList.value.every((route, index) => route.id === newRouteList[index].id)
						|| !routeList.value.every((route, index) => route.top_records.length !== newRouteList[index].top_records.length)

					if (hasChanged) {
						routeList.value = newRouteList;
						routeTabs.value.forEach(tab => tab.routes.splice(0, tab.routes.length));
						console.log("values changed");
						routeTabs.value.forEach(tab => {
							const matchingRoutes = newRouteList.filter(route => route.zone_name === tab.zone);
							tab.routes.push(...matchingRoutes);
						});
					}
				}
			});


			const handleRemoveRecord = async (TUID: string) => {
				const { error } = await supabase
					.from('top_records')
					.delete()
					.eq('TUID', TUID)
				if (error) {
					console.error(error);
					toast({
						title: 'Ascent not removed',
						description: `There was an error: ${error.message}`,
						variant: 'destructive',
					});
					return;
				} else {
					refresh();
					toast({
						title: 'Ascent removed',
						description: `You have removed an ascent!`,
						variant: 'destructive',
					});
				}
			}

</script>

<template>
	<div class="page-container" v-if="userData">
		<div class="page-card sm:rounded-lg bg-background sm:border sm:shadow-lg">
			<div class="w-full py-6">
				<div class="flex w-full flex-row items-center justify-between border-b py-2">
					<h1 class="text-3xl">
						Welcome back
						<span class="capitalize italic text-primary">
							{{ userData?.displayed_name ?? '' }}
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
			<div class="flex flex-row flex-wrap  justify-evenly">
				<UserRouteList :routeTabs="routeTabs" :userData="userData" :refresh="refresh"
					:handleRemoveRecord="handleRemoveRecord" />
				<div class="min-w-[300px] max-w-md">
					<h2 class="text-md">Your Stats</h2>
				</div>
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
