import type { ColumnDef } from '@tanstack/vue-table'
import { h } from 'vue'
import { ArrowUpDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import type { UserTablesType } from '~/pages/dashboard.vue'

export const columns: ColumnDef<UserTablesType>[] = [
  {
    accessorKey: 'displayed_name',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'link',
          class: 'text-xs w-full text-left md:text-md lg:text-lg p-1',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => [
          'Username',
          h(ArrowUpDown, {
            class: 'ml-1 h-3 w-3 text-xs md:text-md lg:text-lg',
          }),
        ],
      )
    },
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-left text-xs md:text-md' },
        row.getValue('displayed_name'),
      ),
  },
  {
    accessorKey: 'points',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'link',
          class: 'text-xs w-full text-center md:text-md lg:text-lg p-1',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => [
          'Score',
          h(ArrowUpDown, {
            class: 'ml-1  h-3 w-3 text-xs md:text-md lg:text-lg',
          }),
        ],
      )
    },
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-center text-xs md:text-md py-4' },
        row.getValue('points'),
      ),
  },
  {
    accessorKey: 'tops',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'link',
          class: 'text-xs w-full text-center md:text-md lg:text-lg p-1',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => [
          'Tops Nbr',
          h(ArrowUpDown, {
            class: 'ml-1  h-3 w-3 text-xs md:text-md lg:text-lg',
          }),
        ],
      )
    },
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-center text-xs md:text-md py-4' },
        row.getValue('tops'),
      ),
  },
  {
    accessorKey: 'height',
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: 'link',
          class: 'text-xs w-full text-center md:text-md lg:text-lg p-1',
          onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
        },
        () => [
          'Height',
          h(ArrowUpDown, {
            class: 'ml-1 h-3 w-3 text-xs md:text-md lg:text-lg',
          }),
        ],
      )
    },
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-center text-xs md:text-md py-4' },
        row.getValue('height'),
      ),
  },
]
