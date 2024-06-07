<script setup
		lang="ts">
			import { MoreHorizontal, Video } from 'lucide-vue-next'
			import { formatDate } from '~/helpers/helpFunctions';

			defineProps<{
				thisRoute: {
					route_date: string | null;
					route_link: string | null;
					route_setter: string | null;
				}
			}>()

</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger as-child>
			<Button variant="ghost" class="w-8 h-8 p-0">
				<span class="sr-only">Open menu</span>
				<MoreHorizontal class="w-4 h-4" />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent align="end">
			<DropdownMenuLabel>
				Set the: {{ thisRoute.route_date !== null ? formatDate(new Date(thisRoute.route_date))
					: '' }}
			</DropdownMenuLabel>
			<DropdownMenuLabel>
				Set by: {{ thisRoute.route_setter?.toUpperCase() }}
			</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuItem v-if="thisRoute.route_link" asChild>
				<a :href="thisRoute.route_link" target="_blank" class="flex flex-row item-center">
					<Video class="w-4 h-4 mr-4" /> Beta Video
				</a>
			</DropdownMenuItem>
			<DropdownMenuItem v-else disabled>
				<Video class="w-4 h-4 mr-4" /> Beta Video
			</DropdownMenuItem>
			<DropdownMenuItem>
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
</template>