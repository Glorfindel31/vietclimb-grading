		
<script setup
				lang="ts">
					import { toTypedSchema } from '@vee-validate/zod'
					import * as z from 'zod'
					import { useForm } from 'vee-validate'

					const ape_index = ref(0)

					const privacySetting = toTypedSchema(z.object({
						hideBirthday: z.boolean().default(true),
						hideHeight: z.boolean().default(true),
						hideArms: z.boolean().default(true),
						hideRank: z.boolean().default(true),
						hideTops: z.boolean().default(true),
					}))

					const privacyForm = [
						{
							name: 'hideBirthday',
							label: 'Birthday Visibility',
							description: 'Your birthday will be displayed to other users.',
						},
						{
							name: 'hideHeight',
							label: 'Height Visibility',
							description: 'You can display your height or not.',
						},
						{
							name: 'hideArms',
							label: 'Arms lenght Visibility',
							description: 'Your arms length will be displayed to other users.',
						},
						{
							name: 'hideRank',
							label: 'Rank Visibility',
							description: 'You will apear in the ranking dashboard.',
						},
						{
							name: 'hideTops',
							label: 'Tops Visibility',
							description: 'You can display or not your personal statistics.',
						},
					]



					const { handleSubmit: handleSubmitPrivacy, setFieldValue, values } = useForm({
						validationSchema: privacySetting,
					})

					const onSubmitPrivacy = handleSubmitPrivacy((values) => {
						console.log('Form submitted!', values)
					})



</script>
<template>
	<div class="flex  max-w-[1400px] flex-col gap-4 rounded-lg border bg-background p-8">
		<div class="flex flex-col">

			<h3 class="m-0 p-0 pb-8  font-thin">Privacy Settings</h3>

			<form @submit="onSubmitPrivacy" class="flex flex-col gap-4 lg:gap-2 lg:justify-between">


				<FormField v-slot="{ value, handleChange }" :name="field.name" v-for="field in privacyForm">
					<FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
						<div class="space-y-0.5">
							<FormLabel class="text-base">
								{{ field.label }}
							</FormLabel>
							<FormDescription>
								{{ field.description }}
							</FormDescription>
						</div>
						<FormControl>
							<Switch :checked="value" @update:checked="handleChange" />
						</FormControl>
					</FormItem>
				</FormField>


				<Button type="submit" class="w-20">Save</Button>
			</form>

		</div>
	</div>
</template>


<style scoped></style>