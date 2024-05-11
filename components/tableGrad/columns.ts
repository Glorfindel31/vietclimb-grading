import type {ColumnDef} from '@tanstack/vue-table';
import {h} from 'vue';
import {ArrowUpDown, Video} from 'lucide-vue-next';
import {Button} from '@/components/ui/button';
export interface Route {
    name: string;
    id: string;
    color: string;
    grade: string;
    setter: string;
    comment: string;
    link: string;
    date: string;
}

export interface DataStructure {
    transformedValues: Route[];
    routeNum: number;
}

function formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
}

export const columns: ColumnDef<Route>[] = [
    {
        accessorKey: 'id',
        header: () => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    class: 'w-full text-xs text-center px-0 md:text-md lg:text-lg',
                },
                () => ['Id'],
            );
        },
        cell: ({row}) =>
            h('div', {class: 'text-center  p-0 text-xs md:text-md'}, row.original.id),
    },
    {
        accessorKey: 'name',
        header: ({column}) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    class: 'w-full text-xs text-center px-1 md:text-md lg:text-lg',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => [
                    'Zone',
                    h(ArrowUpDown, {class: 'ml-1 h-3 w-3 text-xs md:text-md lg:text-lg'}),
                ],
            );
        },
        cell: ({row}) =>
            h(
                'div',
                {class: 'text-center w-full text-xs md:text-md'},
                row.getValue('name'),
            ),
    },
    {
        accessorKey: 'color',
        header: ({column}) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    class: 'w-full text-xs text-center px-1 md:text-md lg:text-lg',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => [
                    'Color',
                    h(ArrowUpDown, {class: 'ml-1 h-3 w-3 text-xs md:text-md lg:text-lg'}),
                ],
            );
        },
        cell: ({row}) =>
            h(
                'div',
                {
                    class: `text-center font-bold rounded-xl bg-${row.original.color} text-${row.original.color}-foreground text-xs  h-5 md:text-md `,
                },
                row.getValue('color'),
            ),
    },
    {
        accessorKey: 'grade',
        header: ({column}) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    class: 'w-full text-xs text-center px-1 md:text-md lg:text-lg',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => ['LvL', h(ArrowUpDown, {class: 'ml-1 h-3 w-3 text-xs md:text-md'})],
            );
        },
        cell: ({row}) =>
            h('div', {class: 'text-center text-xs md:text-md'}, row.getValue('grade')),
    },
    {
        accessorKey: 'setter',
        header: ({column}) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    class: 'w-full text-xs text-center px-1 md:text-md lg:text-lg',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => [
                    'Setter',
                    h(ArrowUpDown, {class: 'ml-1 h-3 w-3 text-xs md:text-md'}),
                ],
            );
        },
        cell: ({row}) =>
            h(
                'div',
                {class: 'text-center capitalize text-xs px-1 md:text-md'},
                row.getValue('setter'),
            ),
    },
    {
        accessorKey: 'date',
        header: ({column}) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    class: 'w-full text-xs text-center px-1 md:text-md lg:text-lg',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => [
                    'Date',
                    h(ArrowUpDown, {class: 'ml-1 h-3 w-3 text-xs md:text-md'}),
                ],
            );
        },
        cell: ({row}) =>
            h(
                'div',
                {class: 'text-center capitalize text-xs px-1 md:text-md '},
                formatDate(row.getValue('date')),
            ),
    },
    {
        accessorKey: 'link',
        header: ({column}) => {
            return h(
                Button,
                {
                    variant: 'ghost',
                    class: 'w-full text-xs text-center px-1 md:text-md lg:text-lg',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
                },
                () => [
                    'Beta',
                    h(ArrowUpDown, {class: 'ml-1 h-3 w-3 text-xs md:text-md'}),
                ],
            );
        },
        cell: ({row}) =>
            h(
                Button,
                {
                    variant: 'outline',
                    disabled: !row.getValue('link'),
                    size: 'icon',
                    class: 'text-center capitalize text-xs px-1 md:text-md',
                    onClick: () => window.open(row.getValue('link'), '_blank'),
                },
                () => h(Video, {class: 'ml-1 h-5 w-5 text-xs text-center md:text-md'}),
            ),
    },
];
