<script setup
		lang="ts">
			import { type UserWithTopRecords } from "@/types/userTable.type"
			import { type RouteTabsDataType } from "@/types/userTable.type"
			import { stringCompressor } from "~/helpers/helpFunctions";
			import { Icon } from "@iconify/vue";

			const props = defineProps<{
				routeTabs: RouteTabsDataType;
				userData: UserWithTopRecords;
				refresh: () => void;
				handleRemoveRecord: (TUID: string) => Promise<void>;
			}>();

			const computeMode = (numbers: Array<number>): number => {
				const counts: Record<string, number> = {};
				let maxCount = 0;
				let mode: number | undefined;

				numbers.forEach(num => {
					counts[num] = (counts[num] || 0) + 1;
				});

				maxCount = Math.max(...Object.values(counts));

				Object.keys(counts).forEach(key => {
					if (counts[key] === maxCount) {
						mode = Number(key);
						return;
					}
				});
				if (mode === undefined) {
					return 0;
				}
				return mode;
			}

</script>

<template>
	<Tabs v-if="props.userData" default-value="Moon Korner" class="min-w-[300px] max-w-md">
		<TabsList class="grid w-full grid-cols-9">
			<TabsTrigger v-for="(tab, index) in routeTabs" :value="tab.zone" :key="index">
				{{ tab.tabName }}
			</TabsTrigger>
		</TabsList>
		<TabsContent v-for="(tab, index) in routeTabs" :value="tab.zone" :key="index">
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
							<TableHead class="text-base font-bold text-foreground">
								Route List - Route Number: {{ tab.routes.length }}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow v-for="row, index in tab.routes" :key="index" class="flex flex-row justify-between">
							<TableCell class="flex flex-col justify-center gap-1 px-2 py-3">
								<div class="px-2 py-1 text-sm font-bold">
									{{ row.zone_name }}
								</div>
								<div class="p-1 text-center text-xs"
									:class="`bg-${row.route_color?.toString()} text-${row.route_color?.toString()}-foreground rounded-full`">
									{{ row.route_color?.toUpperCase() }}
								</div>
								<div class="pl-2 text-xs italic">
									Set by: <span class="capitalize">{{ row.route_setter }}</span>
								</div>
							</TableCell>
							<TableCell class="flex flex-row items-center gap-4 px-2 py-3">


								<div class="flex flex-col gap-1 text-xs">
									<div>Grade:</div>
									<div>Setter's - {{ row.route_grade }}</div>
									<div :key="index">Comunity's - {{ row.top_records.length > 0 ?
										computeMode(
											row.top_records
												.map(route => route.user_grade)
												.filter((grade): grade is number => grade !== null)
										) : "n/a" }}</div>
									<div class="flex flex-row items-center gap-1 italic">
										Rate:
										<StarsRating :key="index" :rating="row.top_records.length > 0 ?
											computeMode(
												row.top_records
													.map(route => route.user_rate)
													.filter((rate): rate is number => rate !== null)
											) : 0" />
									</div>
								</div>
								<Dialog v-if="userData.top_records.some(record => record.URID_linked === row.URID)"
									:key="row?.URID?.toString()">
									<DialogTrigger as-child>
										<Button variant="outline" size="icon"
											class="hover:bg-destructive border-green-600 text-green-600">
											<Icon icon="radix-icons:cross-2" class="h-5 w-5" />
										</Button>
									</DialogTrigger>
									<DialogContent class="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Remove your top Record?</DialogTitle>
											<DialogDescription>
												Are you sure you want to remove this route from your records?
												<div
													class="border p-2 rounded-lg flex flex-col gap-1 justify-center my-2">
													<div class="px-2 py-1 text-sm font-bold">
														{{ row.zone_name }}
													</div>
													<div class="py-1 px-2 text-center text-xs w-fit self-center"
														:class="`bg-${row.route_color?.toString()} text-${row.route_color?.toString()}-foreground rounded-full`">
														{{ row.route_color?.toUpperCase() }}
													</div>
													<div class="pl-2 text-xs italic">
														Set by: <span class="capitalize">{{ row.route_setter }}</span>
													</div>
													<div>Grade:</div>
													<div>Setter's - {{ row.route_grade }}</div>
													<div :key="index">Comunity's - {{ row.top_records.length > 0 ?
														computeMode(
															row.top_records
																.map(route => route.user_grade)
																.filter((grade): grade is number => grade !== null)
														) : "n/a" }}</div>
													<div
														class="flex flex-row items-center gap-1 text-xs italic justify-center">
														Rate:
														<StarsRating :key="index" :rating="row.top_records.length > 0 ?
															computeMode(
																row.top_records
																	.map(route => route.user_rate)
																	.filter((rate): rate is number => rate !== null)
															) : 0" />
													</div>
												</div>
											</DialogDescription>
										</DialogHeader>
										<DialogFooter class="flex flex-col gap-2">
											<DialogClose asChild>
												<Button type="button" variant="destructive"
													@click="() => props.handleRemoveRecord(stringCompressor(row.URID + userData.UID))">
													Delete
												</Button>
											</DialogClose>
											<DialogClose asChild>
												<Button type="button" variant="outline">
													Cancel
												</Button>
											</DialogClose>
										</DialogFooter>
									</DialogContent>
								</Dialog>
								<Drawer v-else>
									<DrawerTrigger asChild>
										<Button variant="outline" size="icon">
											<Icon icon="radix-icons:plus" class="h-5 w-5" />
										</Button>
									</DrawerTrigger>
									<DrawerContent>
										<DrawerHeader class="flex flex-col justify-center">
											<DrawerTitle class="text-center text-2xl  py-5">
												{{ row.zone_name }}
											</DrawerTitle>
											<DrawerDescription class="text-center text-sm" hidden>
												Fill the form to submit your top
											</DrawerDescription>
											<div class="flex flex-row rounded-lg p-4 gap-2 self-center">
												<div class="w-fit self-center text-center text-xs font-bold px-2 py-1"
													:class="`bg-${row.route_color?.toString()} text-${row.route_color?.toString()}-foreground rounded-full`">
													{{ row.route_color?.toUpperCase() }}
												</div>
												<div class="text-left">
													<div>Setter's grade: {{ row.route_grade }}</div>
													<div class="text-xs italic">
														Set by:
														<span class="capitalize">
															{{ row.route_setter }}
														</span>
													</div>
												</div>
											</div>
											<div class="border rounded flex flex-col justify-center p-4">
												<FormTops :routeData="row" :userData="props.userData"
													:refresh="props.refresh" />
											</div>
										</DrawerHeader>
										<DrawerFooter>
											<DrawerClose asChild class="self-center">
												<Button variant="outline" size="icon">
													<Icon icon="radix-icons:cross-1" class="w-6 h-6" />
												</Button>
											</DrawerClose>
										</DrawerFooter>
									</DrawerContent>
								</Drawer>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Card>
		</TabsContent>
	</Tabs>
</template>

<style lang="css"
	   scoped></style>
