<script setup
		lang="ts">
			import {
				NavigationMenuItem,
			} from '@/components/ui/navigation-menu';
</script>

<template>
	<NavigationMenuItem>
		<Button as-child>
			<NuxtLink to="/register">
				Register
			</NuxtLink>
		</Button>
	</NavigationMenuItem>
	<NavigationMenuItem>
		<Button as-child variant="secondary">
			<NuxtLink to="/login">
				Login
			</NuxtLink>
		</Button>
	</NavigationMenuItem>
</template>
