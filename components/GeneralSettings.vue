		
<script setup
				lang="ts">
					import { toTypedSchema } from '@vee-validate/zod'
					import * as z from 'zod'
					import { useForm } from 'vee-validate'

					const ape_index = ref(0)

					const generalSetting = toTypedSchema(z.object({
						displayName: z.string().regex(/^[a-zA-Z0-9\p{Emoji}]+$/u).min(3).max(50),
						height: z.number().positive().gte(100, 'Height must be greater than 100 cm').lte(300, 'Height must be less than 300 cm').default(160),
						arms: z.number().positive().gte(100, 'Arms must be greater than 100 cm').lte(300, 'Arms must be less than 300 cm').default(160),
						birthday: z
							.string()
							.refine(v => v, { message: 'A date of birth is required.' }),
					}))

					const { handleSubmit: handleSubmitGeneral, setFieldValue, values } = useForm({
						validationSchema: generalSetting,
					})

					const onSubmitGeneral = handleSubmitGeneral((values) => {
						console.log('Form submitted!', values)
					})

					watch(values, (newValues) => {
						ape_index.value = newValues.arms && newValues.height ? (newValues.arms - newValues.height) : 0;
					}, { deep: true });

</script>
<template>
	<div class="flex  max-w-[1400px] flex-col gap-4 rounded-lg border bg-background p-8">
		<div class="flex flex-col">

			<h3 class="m-0 p-0 pb-8  font-thin">General Settings</h3>

			<form @submit="onSubmitGeneral" class="flex flex-col gap-8">

				<FormField v-slot="{ componentField }" name="displayName">
					<FormItem class="flex flex-row gap-2 p-2 items-center space-y-0">
						<div class="flex flex-col gap-2 w-full">
							<FormLabel class="text-md font-bold">UserName</FormLabel>
							<FormDescription>
								Your name will be displayed to other users.
							</FormDescription>
						</div>
						<div class="flex flex-col w-80">
							<FormControl>
								<Input type="text" placeholder="Displayed Name" v-bind="componentField" />
							</FormControl>
							<FormMessage class="pl-2 pt-2" />
						</div>
					</FormItem>
				</FormField>

				<FormField v-slot="{ componentField }" name="height">
					<FormItem class="flex flex-row gap-4 p-2 items-center space-y-0">
						<div class="flex flex-col gap-2 w-full">
							<FormLabel class="text-md font-bold">Height</FormLabel>
							<FormDescription>
								Your height will be displayed to other users in cm and used to compute your ape
								index.
							</FormDescription>
						</div>
						<div class="flex flex-col w-80">
							<FormControl>
								<FormControl>
									<Input type="number" placeholder="Height in cm" v-bind="componentField" />
								</FormControl>
							</FormControl>
							<FormMessage class="pl-2 pt-2" />
						</div>
					</FormItem>
				</FormField>

				<FormField v-slot="{ componentField }" name="arms">
					<FormItem class="flex flex-row justify-between p-2 items-center space-y-0 gap-4">
						<div class="flex flex-col gap-2 w-full">
							<FormLabel class="text-md font-bold">Arms lenght</FormLabel>
							<FormDescription>
								Your arms lenght will be displayed to other users in cm and used to compute your
								ape index. (Both arms in a T pose mesured from finger to finger).
							</FormDescription>
						</div>
						<div class="flex flex-col w-80">
							<FormControl>
								<FormControl>
									<Input type="number" placeholder="Arms lenght in cm" v-bind="componentField" />
								</FormControl>
							</FormControl>
						</div>
					</FormItem>
				</FormField>

				<FormField v-slot="{ componentField }" name="birthday">
					<FormItem class="flex flex-row  p-2 items-center space-y-0 gap-4">
						<div class="flex flex-col gap-2 w-full">
							<FormLabel class="text-md font-bold">birthday</FormLabel>
							<FormDescription>
								Your birthday will be displayed to other users.
							</FormDescription>
						</div>
						<div class="flex flex-col w-80">
							<FormControl>
								<FormControl>
									<Input type="date" placeholder="Arms lenght in cm" v-bind="componentField" />
								</FormControl>
							</FormControl>
						</div>
					</FormItem>
				</FormField>

				<div class="flex flex-row gap-2 p-2 items-center space-y-0">
					<div class="flex flex-col gap-2 w-80 justify-between">
						<h3 class="text-md">Ape Index</h3>
						<p class="text-sm text-muted-foreground"> Your Ape index is the relational size between your
							arms size and your height. It can be
							positive or negative</p>
					</div>
					<div>
						<h3>{{ ape_index }}</h3>
					</div>
				</div>

				<Button type="submit" class="w-20">Save</Button>
			</form>

		</div>
	</div>
</template>


<style scoped></style>