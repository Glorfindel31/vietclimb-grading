<script setup
		lang="ts">
			import {
				NavigationMenu,
				NavigationMenuItem,
				NavigationMenuList,
				navigationMenuTriggerStyle
			} from '@/components/ui/navigation-menu';

			import ToggleMode from './ToggleMode.vue';
			import type { Database } from '~/database.types'

			let client = ref();
			let user = ref();

			onMounted(async () => {
				client.value = useSupabaseClient<Database>();
				user.value = useSupabaseUser();
			});

			const logOutHandler = async () => {
				try {
					await client.value.auth.signOut();

				} catch (error) {
					console.error('Error logging out:', error as Error);
				}
			};
</script>

<template>
	<ClientOnly>
		<NavigationMenu class="flex flex-row justify-between min-w-full">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NuxtLink to="/">
						<NavigationMenuLink :class="navigationMenuTriggerStyle()">
							<img src="/logo-light.svg" alt="logo" class="w-6 h-6 dark:hidden block" />
							<img src="/logo-dark.svg" alt="logo" class="w-6 h-6 dark:block hidden" />
						</NavigationMenuLink>
					</NuxtLink>
				</NavigationMenuItem>
			</NavigationMenuList>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NuxtLink to="/about">
						<NavigationMenuLink :class="navigationMenuTriggerStyle()">
							About
						</NavigationMenuLink>
					</NuxtLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NuxtLink to="/public">
						<NavigationMenuLink :class="navigationMenuTriggerStyle()">
							Public Stats
						</NavigationMenuLink>
					</NuxtLink>
				</NavigationMenuItem>
				<UserNav v-if="user.value" :logOutHandler="logOutHandler" />
				<PublicNav v-else />
				<NavigationMenuItem>
					<ToggleMode />
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	</ClientOnly>
</template>
