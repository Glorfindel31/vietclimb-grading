<script setup
		lang="ts">
			import type { Database } from "~/types/supabase.type";
			import type { dataMutationResult } from "~/server/api/googlesheet.get";
			import { formatDateString } from "~/helpers/helpFunctions";
			import { Spinner } from "@/components/ui/spinner";
			import { useToast } from '@/components/ui/toast/use-toast'

			import {
				HoverCard,
				HoverCardContent,
				HoverCardTrigger,
			} from '@/components/ui/hover-card'

			definePageMeta
				({
					middleware
						: ["auth-admin"]
					// or middleware: 'auth'
				})

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

			const { toast } = useToast();
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
									URID: `URID_${index + 1}_${route.id}_${route.name.replace(/\s+/g, "")}_${route.color}_${route.setter.replace(/\s+/g, "")}_${route.date}`,
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

			const modifiedGroup = ref<{ supabase: DataBaseExtended[], google: newGoogleRows[] }>({ supabase: [], google: [] });

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

				modifiedGroup.value = { google: (allData.value?.googleData as any) as newGoogleRows[], supabase: (checkData.value as any) as DataBaseExtended[] }
			}

			dataChanges()

			watch(allData, () => {
				dataChanges()
			});

			const updateHandler = async (e: Event) => {
				e.preventDefault();
				const array = await JSON.parse(JSON.stringify(dataToUpdate.value));
				if (array.length === 0) {
					toast({
						title: 'No data to update',
						description: `😒`,
						variant: 'destructive',
					});
					return;
				}
				try {
					const { data, error } = await supabase
						.from("routes")
						.upsert(array)
						.select();
					if (data) {

						toast({
							title: 'Data updated',
							description: 'Data has been updated successfully',
						});
					} else if (error) {
						console.error("Error updating data", error);
						toast({
							title: 'Error updating data',
							description: `error updating data${error}`,
							variant: 'destructive',
						});
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
				toast({
					title: 'Fresh start',
					description: 'Fetching your precious data',
				});
			};

</script>

<template>
	<div class="page-container">
		<div class="page-card rounded-lg border bg-background">
			<div class="h-full">
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
			<div v-else-if="modifiedGroup" class="flex flex-col sm:flex-row gap-2">
				<Table v-for="(dataList, index) in modifiedGroup" class="rounded border p-1 text-center text-xs"
					:key="index">
					<TableCaption>Raw <span class="capitalize">{{ index }}</span> Sheet Data</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead class="w-full text-center text-base font-bold" colspan="7">
								<span class="capitalize">{{ index }}</span> Sheet Data
							</TableHead>
						</TableRow>
						<TableRow class="text-base">
							<TableHead class="text-left py-4 px-2 min-w-20">
								<div class="flex flex-col">
									<p class="font-bold">ID</p>
									<p class="font-bold">RID</p>
								</div>
							</TableHead>
							<TableHead class="text-center py-4 px-2">
								<div class="flex flex-col">
									<p class="font-bold">Zone Name</p>
									<p class="font-bold">Color</p>
									<p class="font-bold">Setter</p>
								</div>
							</TableHead>
							<TableHead class="text-right py-4 px-2">
								<div class="flex flex-col">
									<p class="font-bold">Route Grade</p>
									<p class="font-bold">URID</p>
									<p class="font-bold">Date</p>
								</div>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow v-for="route in dataList" :key="route.id"
							:class="index === 'supabase' && ('identicale' in route) && !route.identicale ? 'bg-destructive' : ''">
							<TableCell class="py-4 px-2 text-sm min-w-20">
								<div class="flex flex-col text-left">
									<p>ID-{{ route.id }}</p>
									<p>RID-{{ route.RID }}</p>
								</div>
							</TableCell>
							<TableCell class="text-center py-4 px-2 text-sm w-full">
								<div class="flex flex-col gap-1 items-center">
									<p>{{ route.zone_name }}</p>
									<p class="uppercase w-fit py-0.5 px-4 rounded-full"
										:class="route.route_color ? `bg-${route.route_color?.toString()} text-${route.route_color?.toString()}-foreground` : 'bg-foreground text-background'">
										{{ route.route_color ? route.route_color : "COLOR" }}</p>
									<p class="capitalize">{{ route.route_setter ? route.route_setter : "Setter" }}</p>
								</div>
							</TableCell>
							<TableCell class="text-right py-4 px-2 w-fit">
								<div class="flex flex-col justify-end gap-1">
									<p class="text-sm">Grade: {{ route.route_grade ? route.route_grade : "no grade" }}
									</p>
									<p class="text-[0.7rem]">{{ route.URID?.slice(0, -13) }}</p>
									<p>{{ route.route_date
										? formatDateString(route.route_date)
										: "no date" }}</p>
								</div>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
