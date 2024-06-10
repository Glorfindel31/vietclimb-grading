<script setup
		lang="ts">
			import { type RouteTabsDataType } from "~/pages/user/index.vue";
			import { Icon } from "@iconify/vue";

			const props = defineProps<{
				routeTabs: RouteTabsDataType;
				userID: string;
			}>();

</script>

<template>
	<Tabs default-value="Moon Korner" class="min-w-[300px] max-w-md">
		<TabsList class="grid w-full grid-cols-9">
			<TabsTrigger v-for="tab in routeTabs" :value="tab.zone">
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

						<TableRow v-for="row in tab.routes" :key="row.id" class="flex flex-row justify-between">
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
								<div class="flex flex-col gap-1">
									<div>Grade: {{ row.route_grade }}</div>
									<div class="flex flex-row items-center gap-1 text-xs italic">
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

								<Drawer>
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
												<FormTops :routeData="row" :userID="props.userID" />
											</div>

										</DrawerHeader>

										<DrawerFooter>
											<DrawerClose>
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
