<script setup
		lang="ts">
			import { Icon } from "@iconify/vue/dist/iconify.js";
			import { toTypedSchema } from '@vee-validate/zod'
			import * as z from 'zod'
			import { useForm } from 'vee-validate'

			const heights: { value: number | null; label: string }[] = [];
			const arms: { value: number | null; label: string }[] = [];

			for (let cm = 100; cm < 245; cm += 5) {
				heights.push({
					value: cm,
					label: `${cm} cm / ${(cm / 30.48).toFixed(2)} ft`,
				});
			}
			heights.push({
				value: null,
				label: 'Not specified',
			})
			for (let cm = 100; cm < 245; cm += 1) {
				arms.push({
					value: cm,
					label: `${cm} cm / ${(cm / 30.48).toFixed(2)} ft`,
				});
			}
			arms.push({
				value: null,
				label: 'Not specified',
			})

			const generalSetting = toTypedSchema(z.object({
				displayName: z.string().regex(/^[a-zA-Z0-9\p{Emoji}]+$/u).min(3).max(50),
				height: z.number().nullable().default(null),
				arms: z.number().nullable().default(null),
				birthday: z.date().min(new Date(1900, 1, 1)).max(new Date()),
				single: z.boolean(),
			}))

			// const privacySetting = toTypedSchema(z.object({
			// 	hideBirthday: z.boolean(),
			// 	hideHeight: z.boolean(),
			// 	hideArms: z.boolean(),
			// 	hideRank: z.boolean(),
			// 	hideTops: z.boolean(),
			// 	hideSingle: z.boolean(),
			// }))

			const formGeneral = useForm({
				validationSchema: generalSetting,
			})
			// const formSetting = useForm({
			// 	validationSchema: privacySetting,
			// })

			const onSubmitGeneral = formGeneral.handleSubmit((values) => {
				console.log('Form submitted!', values)
			})

			// const onSubmitPrivacy = formSetting.handleSubmit((values) => {
			// 	console.log('Form submitted!', values)
			// })

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
			<div class="flex flex-col">
				<div>
					<h3>General Settings</h3>

					<form @submit="onSubmitGeneral">
						<FormField v-slot="{ componentField }" name="displayName">
							<FormItem class="flex flex-row gap-2 p-2 items-center space-y-0">
								<div class="flex flex-col gap-2 w-80">
									<FormLabel class="text-md font-bold">UserName</FormLabel>
									<FormDescription>
										Your name will be displayed to other users.
									</FormDescription>
								</div>
								<div class="flex flex-col w-full">
									<FormControl>
										<Input type="text" placeholder="Displayed Name" v-bind="componentField" />
									</FormControl>
									<FormMessage class="pl-2 pt-2" />
								</div>
							</FormItem>
						</FormField>

						<FormField v-slot="{ componentField }" name="height">
							<FormItem class="flex flex-row gap-2 p-2 items-center space-y-0">
								<div class="flex flex-col gap-2 w-80">
									<FormLabel class="text-md font-bold">Height</FormLabel>
									<FormDescription>
										Your height will be displayed to other users in cm and used to compute your ape
										index.
									</FormDescription>
								</div>
								<Select v-bind="componentField">
									<div class="flex flex-col w-full">
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<FormMessage class="pl-2 pt-2" />
										<SelectContent>
											<SelectGroup v-for="(height, i) in heights">
												<SelectItem :key="i" :value="height.value">
													{{ height.label }}
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</div>
								</Select>
							</FormItem>
						</FormField>

						<FormField v-slot="{ componentField }" name="arms">
							<FormItem class="flex flex-row gap-2 p-2 items-center space-y-0">
								<div class="flex flex-col gap-2 w-80">
									<FormLabel class="text-md font-bold">Arms lenght</FormLabel>
									<FormDescription>
										Your arms lenght will be displayed to other users in cm and used to compute your
										ape index. (Both arms in a T pose mesured from finger to finger).
									</FormDescription>
								</div>
								<Select v-bind="componentField">
									<div class="flex flex-col w-full">
										<FormControl>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
										</FormControl>
										<FormMessage class="pl-2 pt-2" />
										<SelectContent>
											<SelectGroup v-for="(arm, i) in arms">
												<SelectItem :key="i" :value="arm.value">
													{{ arm.label }}
												</SelectItem>
											</SelectGroup>
										</SelectContent>
									</div>
								</Select>
							</FormItem>
						</FormField>

						<Button type="submit">Save</Button>
					</form>
				</div>
				<div>

				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>