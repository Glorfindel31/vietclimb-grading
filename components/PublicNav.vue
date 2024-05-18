<script setup
		lang="ts">
			import {
				NavigationMenuItem,
			} from '@/components/ui/navigation-menu';
			import { cn } from '~/lib/utils';

			const props = defineProps({
				class: {
					type: String,
					default: '',
				},
				mobile: {
					type: Boolean,
					default: false,
				}
			})
			const buttonClass = cn(props.class);
			const mobileClass = cn(props.mobile ? "flex flex-col gap-2" : "flex flex-row gap-2")

</script>


<template>
	<div :class="mobileClass">
		<NavigationMenuItem>
			<Button as-child :class="buttonClass">
				<NuxtLink to="/register">
					Register
				</NuxtLink>
			</Button>
		</NavigationMenuItem>
		<NavigationMenuItem>
			<Button as-child variant="secondary" :class="buttonClass">
				<NuxtLink to="/login">
					Login
				</NuxtLink>
			</Button>
		</NavigationMenuItem>
	</div>
</template>
