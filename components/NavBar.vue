<script setup
		lang="ts">
			import {
				Sheet,
				SheetClose,
				SheetContent,
				SheetDescription,
				SheetHeader,
				SheetTitle,
				SheetTrigger,
			} from '@/components/ui/sheet'

			import ToggleMode from './ToggleMode.vue';
			import type { Database } from '~/types/database.types'
			import { Icon } from '@iconify/vue'


			const adminENV = useRuntimeConfig().public.admin
			const client = useSupabaseClient<Database>();
			const user = useSupabaseUser();

			const isAdmin = ref(adminENV === user.value?.id)

			const logOutHandler = async () => {
				try {
					await client.auth.signOut();
					navigateTo('/');
				} catch (error) {
					console.error('Error logging out:', error as Error);
				}
			};

			watch(user, () => {
				isAdmin.value = adminENV === user.value?.id
			})

</script>

<template>
	<!-- Desktop Nav -->
	<div class="sm:flex flex-row justify-between items-center min-w-full hidden p-2">
		<ul>
			<li>
				<NuxtLink to="/">
					<img src="/logo-light.svg" alt="logo" class="w-6 h-6 dark:hidden block" />
					<img src="/logo-dark.svg" alt="logo" class="w-6 h-6 dark:block hidden" />
				</NuxtLink>
			</li>
		</ul>
		<ul class="flex flex-row gap-4">
			<li v-if="isAdmin">
				<Button variant="link" asChild>
					<NuxtLink to="/admin">
						Admin
					</NuxtLink>
				</Button>
			</li>
			<li>
				<Button variant="link" asChild>
					<NuxtLink to="/about">
						About
					</NuxtLink>
				</Button>
			</li>
			<li>
				<Button variant="link" asChild>
					<NuxtLink to="/public">
						Public Stats
					</NuxtLink>
				</Button>
			</li>
			<UserNav v-if="user" :logOutHandler="logOutHandler" />
			<PublicNav v-else />
			<li>
				<ToggleMode />
			</li>
		</ul>
	</div>
	<!-- Mobile Nav -->
	<div class="sm:hidden flex flex-row justify-between min-w-full">
		<ul>
			<li>
				<NuxtLink to="/">
					<img src="/logo-light.svg" alt="logo" class="w-6 h-6 dark:hidden block" />
					<img src="/logo-dark.svg" alt="logo" class="w-6 h-6 dark:block hidden" />
				</NuxtLink>
			</li>
		</ul>
		<ul>
			<li>
				<ToggleMode />
			</li>
			<li>
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
								<li v-if="isAdmin">
									<Button variant="link" asChild>
										<NuxtLink to="/admin">
											Admin
										</NuxtLink>
									</Button>
								</li>
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
									<UserNav v-if="user" :logOutHandler="logOutHandler" class="text-md" mobile />
									<PublicNav v-else class="text-md" mobile />
								</li>
							</SheetClose>
						</ul>
					</SheetContent>
				</Sheet>
			</li>
		</ul>
	</div>
</template>
