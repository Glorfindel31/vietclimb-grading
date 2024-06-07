import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { ArrowUpDown, } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import DropdownAction from './dataTableDropdown.vue'
import type { Tables } from '~/types/supabase.type'


type Route = Tables<"routes">;


function formatDate(isoDate: string): string {
	const date = new Date(isoDate)
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear().toString().slice(-2)
	return `${day}/${month}/${year}`
}

export const columnsUser: ColumnDef<Route>[] = [
	{
		accessorKey: 'zone_name',
		header: ({ column }) => {
			return h(
				Button,
				{
					variant: 'ghost',
					class: 'w-full text-xs text-center px-1 md:text-md lg:text-lg',
					onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
				},
				() => [
					'Zone',
					h(ArrowUpDown, { class: 'ml-1 h-3 w-3 text-xs md:text-md lg:text-lg' })
				]
			)
		},
		cell: ({ row }) =>
			h(
				'div',
				{ class: 'text-center w-full text-xs md:text-md' },
				row.getValue('zone_name')
			)
	},
	{
		accessorKey: 'route_color',
		header: ({ column }) => {
			return h(
				Button,
				{
					variant: 'ghost',
					class: 'w-full text-xs text-center px-1 md:text-md lg:text-lg',
					onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
				},
				() => [
					'Color',
					h(ArrowUpDown, { class: 'ml-1 h-3 w-3 text-xs md:text-md lg:text-lg' })
				]
			)
		},
		cell: ({ row }) =>
			h(
				'div',
				{
					class: `text-center font-bold rounded-xl bg-${row.original.route_color} text-${row.original.route_color}-foreground text-xs  h-5 md:text-md `
				},
				row.getValue('route_color')
			)
	},
	{
		accessorKey: 'route_grade',
		header: ({ column }) => {
			return h(
				Button,
				{
					variant: 'ghost',
					class: 'w-full text-xs text-center px-1 md:text-md lg:text-lg',
					onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
				},
				() => ['LvL', h(ArrowUpDown, { class: 'ml-1 h-3 w-3 text-xs md:text-md' })]
			)
		},
		cell: ({ row }) =>
			h('div', { class: 'text-center text-xs md:text-md' }, row.getValue('route_grade'))
	},
	{
		id: 'topCheck',
		enableHiding: false,
		header: ({ column }) => {
			return h(
				Button,
				{
					variant: 'ghost',
					class: 'w-full text-xs text-center px-1 md:text-md lg:text-lg',
					onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
				},
				() => ['Top', h(ArrowUpDown, { class: 'ml-1 h-3 w-3 text-xs md:text-md' })]
			)
		},
		cell: ({ row }) => {
			const thisRoute = row.original

			return h('div', { class: 'text-center text-xs md:text-md' }, thisRoute ? '✅' : '❌')
		}
	},
	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const thisRoute = row.original

			return h('div', { class: 'relative' }, h(DropdownAction, {
				thisRoute,
			}))
		},
	},
]
