<script setup
		lang="ts">

			import { type RouteTabsDataType } from "~/pages/user/index.vue"
			import { Icon } from '@iconify/vue'
			const props = defineProps<{
				routeTabs: RouteTabsDataType
			}>()


</script>

<template>
	<Tabs default-value="Moon Korner" class="min-w-[300px] max-w-md">
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
								<div class="px-2 py-1 font-bold text-sm">
									{{ row.zone_name }}
								</div>
								<div class="text-xs p-1 text-center"
									:class="`bg-${row.route_color?.toString()} text-${row.route_color?.toString()}-foreground rounded-full`">
									{{ row.route_color?.toUpperCase() }}
								</div>
								<div class="text-xs italic pl-2">
									Set by: <span class="capitalize">{{ row.route_setter }}</span>
								</div>
							</TableCell>
							<TableCell class="flex flex-row px-2 py-3 gap-4 items-center">
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

								<Drawer>
									<DrawerTrigger asChild>
										<Button variant="outline" size="icon">
											<Icon icon="radix-icons:plus" class="h-5 w-5" />
										</Button>
									</DrawerTrigger>
									<DrawerContent>
										<DrawerHeader>
											<DrawerTitle>
												{{ row.zone_name }}
											</DrawerTitle>
											<div class="flex flex-col gap-2 py-4">
												<div class="text-xs px-4 py-2 text-center font-bold w-fit self-center"
													:class="`bg-${row.route_color?.toString()} text-${row.route_color?.toString()}-foreground rounded-full`">
													{{ row.route_color?.toUpperCase() }}
												</div>
												<div>
													Grade: {{ row.route_grade }}
												</div>
												<div class="text-xs italic pl-2">
													Set by: <span class="capitalize">{{ row.route_setter }}</span>
												</div>
											</div>
											<DrawerDescription>Have you top this Route? </DrawerDescription>
										</DrawerHeader>
										<DrawerFooter>
											<DrawerClose>
												<Button variant="outline">
													Cancel
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