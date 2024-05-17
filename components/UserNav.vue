<script setup
		lang="ts">
			import {
				NavigationMenuItem,
			} from '@/components/ui/navigation-menu';


			const props = defineProps({
				logOutHandler: {
					type: Function,
					required: true,
				},
			})

</script>

<template>
	<NavigationMenuItem>
		<Button as-child>
			<NuxtLink to="/">
				Profile
			</NuxtLink>
		</Button>
	</NavigationMenuItem>
	<NavigationMenuItem>
		<Button as-child variant="secondary" @click="props.logOutHandler">
			<NuxtLink to="/login">
				LogOut
			</NuxtLink>
		</Button>
	</NavigationMenuItem>
</template>
