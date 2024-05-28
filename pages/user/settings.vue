<script setup
		lang="ts">
			import { Icon } from "@iconify/vue/dist/iconify.js";
</script>

<template>
	<div class="flex flex-col justify-center p-2 sm:p-10">
		<div class="flex w-full flex-row items-center justify-between max-w-[1400px] p-2">
			<h1 class="text-2xl font-thin">Configuration and Settings</h1>
			<Button size="icon" variant="ghost" asChild>
				<NuxtLink to="/user">
					<Icon icon="radix-icons:chevron-left" class="h-6 w-6" />
				</NuxtLink>
			</Button>
		</div>
		<div class="flex  max-w-[1400px] flex-col gap-4 rounded-lg border bg-background p-4">
			<div class="grid grid-cols-1 sm:grid-cols-2 p-2 sm:p-4">
				<div>
					<h3>General Settings</h3>
				</div>
				<div>
					<!-- <Form>
						<FormField label="Name">
							<Input v-model="name" />
						</FormField>
						<FormField label="Email">
							<Input v-model="email" />
						</FormField>
						<FormField label="Password">
							<Input v-model="password" />
						</FormField>
						<FormField label="Confirm Password">
							<Input v-model="confirmPassword" />
						</FormField>
						<Button type="submit">Save</Button>
					</Form> -->
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>