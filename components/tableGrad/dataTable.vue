<script setup
		lang="ts"
		generic="TData, TValue">
			import type { ColumnDef } from '@tanstack/vue-table';
			import { ref } from 'vue';

			import { valueUpdater } from '~/helpers/helpFunctions';
			import { Button } from '@/components/ui/button';
			import { Input } from '@/components/ui/input';

			import {
				FlexRender,
				getCoreRowModel,
				useVueTable,
				getPaginationRowModel,
				getSortedRowModel,
				getFilteredRowModel,
			} from '@tanstack/vue-table';

			import type { SortingState, ColumnFiltersState, } from '@tanstack/vue-table';

			import {
				Table,
				TableBody,
				TableCell,
				TableHead,
				TableHeader,
				TableRow,
			} from '@/components/ui/table';

			const sorting = ref<SortingState>([]);
			const columnFilters = ref<ColumnFiltersState>([]);

			const props = defineProps<{
				columns: ColumnDef<TData, TValue>[];
				data: TData[];
			}>();

			const table = useVueTable({
				get data() {
					return props.data;
				},
				get columns() {
					return props.columns;
				},
				getCoreRowModel: getCoreRowModel(),
				getPaginationRowModel: getPaginationRowModel(),
				getSortedRowModel: getSortedRowModel(),
				onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
				onColumnFiltersChange: updaterOrValue =>
					valueUpdater(updaterOrValue, columnFilters),
				getFilteredRowModel: getFilteredRowModel(),
				state: {
					get sorting() {
						return sorting.value;
					},
					get columnFilters() {
						return columnFilters.value;
					},
				},
			});
</script>

<template>
	<div class="w-full">
		<div class="flex items-center py-4">
			<Input class="max-w-sm" placeholder="Filter zone..."
				:model-value="table.getColumn('name')?.getFilterValue() as string"
				@update:model-value="table.getColumn('name')?.setFilterValue($event)" />
		</div>
		<Table class="w-full">
			<TableHeader class="overflow-hidden">
				<TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
					<TableHead v-for="header in headerGroup.headers" :key="header.id" class="px-1">
						<FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
							:props="header.getContext()" />
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<template v-if="table.getRowModel().rows?.length">
					<TableRow v-for="row in table.getRowModel().rows" :key="row.id"
						:data-state="row.getIsSelected() ? 'selected' : undefined">
						<TableCell v-for="cell in row.getVisibleCells()" :key="cell.id"
							class="px-1 py-1 sm:py-2 text-center">
							<FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
						</TableCell>
					</TableRow>
				</template>
				<template v-else>
					<TableRow>
						<TableCell :colSpan="columns.length" class="h-24 text-center">
							No results.
						</TableCell>
					</TableRow>
				</template>
			</TableBody>
		</Table>
		<div class="flex items-center justify-end p-4 space-x-2">
			<Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
				Previous
			</Button>
			<Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
				Next
			</Button>
		</div>
	</div>
</template>
