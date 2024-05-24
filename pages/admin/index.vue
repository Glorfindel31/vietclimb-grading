<script setup
		lang="ts">
			import type { Database } from "~/database.types";
			import type { dataMutationResult } from "~/server/api/googlesheet.get";
			import { formatDateString } from "~/lib/definition";
			import Spinner from "~/components/ui/spinner/Spinner.vue";

			import {
				HoverCard,
				HoverCardContent,
				HoverCardTrigger,
			} from '@/components/ui/hover-card'

			// db connection
			const supabase = useSupabaseClient<Database>();

			const {
				pending,
				data: allData,
				refresh,
			} = await useLazyAsyncData(
				"allData",
				async () => {
					const { data: supabaseData } = await supabase.from("routes").select("*");
					const response = await $fetch("/api/googlesheet");
					const typedResponse = response as unknown as dataMutationResult;
					const googleData = typedResponse.transformedValues;
					return { googleData: googleData, supabaseData: supabaseData };
				},
				{
					transform: (data) => {
						return {
							googleData: data.googleData.map((route) => {
								return {
									RID: route.id,
									URID: `URID_${route.id}_${route.name.replace(/\s+/g, "")}_${route.color}_${route.grade}_${route.setter.replace(/\s+/g, "")}_${route.date}`,
									zone_name: route.name,
									route_color: route.color,
									route_grade: route.grade,
									route_setter: route.setter,
									route_date: route.date,
									route_link: route.link,
								};
							}),
							supabaseData: data.supabaseData,
						};
					},
				},
			);
</script>

<template>
	<div class="min-h-[80vh] w-full px-2 py-4">
		<div class="flex flex-col gap-8 rounded-lg border bg-background p-2 shadow-md min-h-[80vh]">
			<div class="p-4 h-full">
				<h2>Admin</h2>
				<div class="flex flex-row justify-between py-4 align-middle">
					<p class="italic">Welcome into the database synchronisation tool.</p>
					<Button @click="refresh" size="sm" variant="default">
						Refresh
					</Button>
				</div>
			</div>
			<div v-if="pending" class="flex flex-col min-h-[60vh] justify-center items-center">
				<Spinner />
			</div>
			<div v-else-if="allData?.googleData && allData?.supabaseData" class="flex flex-row gap-2">
				<Table class="rounded border p-1 text-center text-xs">
					<TableCaption>Raw Google Sheet Data</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead class="w-full text-center text-sm font-bold" colspan="7">
								Google Sheet Data
							</TableHead>
						</TableRow>
						<TableRow>
							<TableHead class="w-[50px] text-center">RID</TableHead>
							<TableHead class="text-center">Zone Name</TableHead>
							<TableHead class="text-center">Route Color</TableHead>
							<TableHead class="w-[50px] text-center">
								Route Grade
							</TableHead>
							<TableHead class="text-center">Route Setter</TableHead>
							<TableHead class="text-center">Route Date</TableHead>
							<TableHead class="text-center">Route link</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow v-for="route in allData.googleData" :key="route.RID">
							<TableCell>{{ route.RID }}</TableCell>
							<TableCell class="text-nowrap">{{ route.zone_name }}</TableCell>
							<TableCell class="text-nowrap">{{
								route.route_color
							}}</TableCell>
							<TableCell class="text-nowrap">{{
								route.route_grade
							}}</TableCell>
							<TableCell class="text-nowrap">
								{{ route.route_setter }}
							</TableCell>
							<TableCell class="text-nowrap">
								{{
									route.route_date
										? formatDateString(route.route_date)
										: "no date"
								}}
							</TableCell>
							<TableCell>{{
								route.route_link ? "link" : "nolink"
							}}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
				<Table class="rounded border p-1 text-center text-xs">
					<TableCaption>Raw Supabase Sheet Data</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead class="w-full text-center text-sm font-bold" colspan="7">
								Supabase Data
							</TableHead>
						</TableRow>
						<TableRow>
							<TableHead class="w-[50px] text-center">RID</TableHead>
							<TableHead class="text-center">Zone Name</TableHead>
							<TableHead class="text-center">Route Color</TableHead>
							<TableHead class="w-[50px] text-center">
								Route Grade
							</TableHead>
							<TableHead class="text-center">Route Setter</TableHead>
							<TableHead class="text-center">Route Date</TableHead>
							<TableHead class="text-center">Route link</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow v-for="route in allData.supabaseData" :key="route.id" class="bg-destructive">
							<TableCell>{{ route.RID }}</TableCell>
							<TableCell class="text-nowrap">{{ route.zone_name }}</TableCell>
							<TableCell class="text-nowrap">{{
								route.route_color
							}}</TableCell>
							<TableCell class="text-nowrap">{{
								route.route_grade
							}}</TableCell>
							<TableCell class="text-nowrap">
								{{ route.route_setter }}
							</TableCell>
							<TableCell class="text-nowrap">
								{{
									route.route_date
										? formatDateString(route.route_date)
										: "no date"
								}}
							</TableCell>
							<TableCell>{{
								route.route_link ? "link" : "nolink"
							}}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
