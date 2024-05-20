<script setup
		lang="ts">
			import {
				NavigationMenu,
				NavigationMenuItem,
				NavigationMenuList,
				navigationMenuTriggerStyle
			} from '@/components/ui/navigation-menu';

			import {
				Sheet,
				SheetClose,
				SheetContent,
				SheetDescription,
				SheetFooter,
				SheetHeader,
				SheetTitle,
				SheetTrigger,
			} from '@/components/ui/sheet'

			import ToggleMode from './ToggleMode.vue';
			import type { Database } from '~/database.types'
			import { Icon } from '@iconify/vue'

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
		<!-- Desktop Nav -->
		<NavigationMenu class="sm:flex flex-row justify-between min-w-full hidden">
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
		<!-- Mobile Nav -->
		<NavigationMenu class="sm:hidden flex flex-row justify-between min-w-full">
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
					<ToggleMode />
				</NavigationMenuItem>
				<NavigationMenuItem>
					<Sheet>
						<SheetTrigger as-child>
							<Button variant="ghost" size="icon">
								<Icon icon="radix-icons:hamburger-menu" class="h-[1.2rem] w-[1rem]" />
							</Button>
						</SheetTrigger>
						<SheetContent side="top">
							<SheetHeader>
								<SheetTitle>Menu</SheetTitle>
								<SheetDescription hidden>
									Navigation menu
								</SheetDescription>
							</SheetHeader>
							<ul class="flex flex-col gap-2 justify-center">
										<SheetClose>
											<li>
												<Button variant="link" asChild class="text-md">
													<NuxtLink to="/about">
														About
													</NuxtLink>
												</Button>
											</li>
											<li>
												<Button variant="link" asChild class="text-md">
													<NuxtLink to="/public">
														Public Stats
													</NuxtLink>
												</Button>
											</li>
											<li>
												<UserNav v-if="user.value" :logOutHandler="logOutHandler"
													class="text-md" mobile />
												<PublicNav v-else class="text-md" mobile />
											</li>
										</SheetClose>
									</ul>
						</SheetContent>
					</Sheet>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	</ClientOnly>
</template>
