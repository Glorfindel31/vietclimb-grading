<script setup
		lang="ts">
			import type { Database } from "~/database.types";
			import type { dataMutationResult } from "~/server/api/googlesheet.get";
			import { formatDateString } from "~/lib/definition";
			import { Spinner } from "@/components/ui/spinner";

			interface RowsAdditional {
				identicale?: boolean;
			}
			interface newGoogleRows {
				id: number,
				RID: string
				URID: string,
				zone_name: string | null,
				route_color: string | null,
				route_grade: string | null,
				route_setter: string | null,
				route_date: string | null,
				route_link: string | null,
			}

			type dataMutationResultExtended = dataMutationResult & RowsAdditional;

			type DataBaseInsert = Database["public"]["Tables"]["routes"]["Insert"];
			type DataBaseExtended = Database["public"]["Tables"]["routes"]["Row"] & RowsAdditional;

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
					const typedResponse = response as unknown as dataMutationResultExtended;
					const googleData = typedResponse.transformedValues;
					return { googleData: googleData, supabaseData: supabaseData };
				},
				{
					transform: (data) => {
						return {
							googleData: data.googleData.map((route, index) => {
								return {
									id: index + 1,
									RID: route.id,
									URID: route.color !== '' && route.grade !== '' ? `URID_${route.id}_${route.name.replace(/\s+/g, "")}_${route.color}_${route.grade}_${route.setter.replace(/\s+/g, "")}_${route.date}` : '',
									zone_name: route.name,
									route_color: route.color !== '' ? route.color : null,
									route_grade: route.grade !== "" ? route.grade : null,
									route_setter: route.setter !== "" ? route.setter : null,
									route_date: route.date !== "" ? route.date : null,
									route_link: route.link !== "" ? route.link : null,
								};
							}).sort((a, b) => a.id - b.id) || [],
							supabaseData: data.supabaseData?.sort((a, b) => a.id - b.id) || [],
						};
					},
				},
			);

			const checkData = ref<DataBaseExtended[]>([]);
			const dataToUpdate = ref<DataBaseInsert[]>([]);
			const idArrays = ref<Array<number | string>>([]);

			const isIdentical = (googleData: newGoogleRows[], supabaseData: DataBaseExtended[]) => {
				const supabaseDataURID: DataBaseExtended[] = supabaseData.map((route, index) => {
					const identicale = googleData[index].URID === route.URID ? true : false;
					return {
						...route,
						identicale: identicale
					}
				});
				return supabaseDataURID as DataBaseExtended[];
			}

			const dataChanges = () => {
				checkData.value = isIdentical(allData.value?.googleData || [] as newGoogleRows[], allData.value?.supabaseData || [] as DataBaseExtended[]);

				idArrays.value = checkData.value
					.filter((route) => route.identicale === false)
					.map((route) => [
						route.id,
					]).flat();

				dataToUpdate.value = (allData.value?.googleData.filter((route) => idArrays.value.includes(route.id)) || []).map((route) => ({
					id: Number(route.id),
					route_color: route.route_color,
					route_date: route.route_date,
					route_grade: Number(route.route_grade) === 0 ? null : Number(route.route_grade),
					route_link: route.route_link,
					route_setter: route.route_setter,
					URID: route.URID,
					zone_name: route.zone_name,
				}));
			}

			dataChanges()

			watch(allData, () => {
				dataChanges()
			});


			const updateHandler = async (e: Event) => {
				e.preventDefault();
				const array = await JSON.parse(JSON.stringify(dataToUpdate.value));
				if (array.length === 0) {
					console.log("No data to update");
					return;
				}
				try {
					const { data, error } = await supabase
						.from("routes")
						.upsert(array)
						.select();
					if (data) {
						console.log("Data updated", data);
					} else if (error) {
						console.error("Error updating data", error);
					}
				} catch (error) {
					console.error("Error updating data", error);
				} finally {
					refresh();
				}
			};

			const refreshHandler = (e: Event) => {
				e.preventDefault();
				refresh();
			};


</script>

<template>
	<div class="min-h-[80vh] w-full px-2 py-4">
		<div class="flex flex-col gap-8 rounded-lg border bg-background p-2 shadow-md min-h-[80vh]">
			<div class="p-4 h-full">
				<h2>Admin</h2>
				<div class="flex flex-row justify-between py-4 align-middle">
					<p class="italic">Welcome into the database synchronisation tool.</p>
					<div class="flex gap-2">
						<Button @click="refreshHandler" size="sm" variant="outline">
							Refresh
						</Button>
						<Button @click="updateHandler" size="sm" variant="outline">
							Update
						</Button>
					</div>
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
							<TableHead class="text-center">ID - RID</TableHead>
							<TableHead class="text-center">Zone Name</TableHead>
							<TableHead class="text-center">Route Color</TableHead>
							<TableHead class="text-center">
								Route Grade
							</TableHead>
							<TableHead class="text-center">Route Setter</TableHead>
							<TableHead class="text-center">Route Date</TableHead>
							<TableHead class="text-center">Route link</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow v-for="route in allData.googleData" :key="route.RID">
							<TableCell class="py-4 px-1">{{ route.id }}-{{ route.RID }}</TableCell>
							<TableCell class="text-nowrap py-4 px-1">{{ route.zone_name }}</TableCell>
							<TableCell class="text-nowrap py-4 px-1">{{
								route.route_color
							}}</TableCell>
							<TableCell class="text-nowrap py-4 px-1">{{
								route.route_grade
							}}</TableCell>
							<TableCell class="text-nowrap py-4 px-1">
								{{ route.route_setter }}
							</TableCell>
							<TableCell class="text-nowrap py-4 px-1">
								{{
									route.route_date
										? formatDateString(route.route_date)
										: "no date"
								}}
							</TableCell>
							<TableCell class="py-4 px-1">{{
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
							<TableHead class="text-center">ID - RID</TableHead>
							<TableHead class="text-center">Zone Name</TableHead>
							<TableHead class="text-center">Route Color</TableHead>
							<TableHead class="text-center">
								Route Grade
							</TableHead>
							<TableHead class="text-center">Route Setter</TableHead>
							<TableHead class="text-center">Route Date</TableHead>
							<TableHead class="text-center">Route link</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow v-for="route in checkData" :key="route.id"
							:class="!route.identicale ? 'bg-destructive' : ''">
							<TableCell class="py-4 px-1">{{ route.id }}-{{ route.RID }}</TableCell>
							<TableCell class="text-nowrap py-4 px-1">{{ route.zone_name }}</TableCell>
							<TableCell class="text-nowrap py-4 px-1">{{
								route.route_color
							}}</TableCell>
							<TableCell class="text-nowrap py-4 px-1">{{
								route.route_grade
							}}</TableCell>
							<TableCell class="text-nowrap py-4 px-1">
								{{ route.route_setter }}
							</TableCell>
							<TableCell class="text-nowrap py-4 px-1">
								{{
									route.route_date
										? formatDateString(route.route_date)
										: "no date"
								}}
							</TableCell>
							<TableCell class="py-4 px-1">{{
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
