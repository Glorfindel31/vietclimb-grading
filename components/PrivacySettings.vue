		
<script setup
				lang="ts">
					import { toTypedSchema } from '@vee-validate/zod'
					import * as z from 'zod'
					import { useForm } from 'vee-validate'

					const ape_index = ref(0)

					const privacySetting = toTypedSchema(z.object({
						hideBirthday: z.boolean(),
						hideHeight: z.boolean(),
						hideArms: z.boolean(),
						hideRank: z.boolean(),
						hideTops: z.boolean(),
						hideSingle: z.boolean(),
					}))

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

			<h3 class="m-0 p-0 pb-8  font-thin">General Settings</h3>

			<form @submit="onSubmitPrivacy" class="flex flex-col gap-8">

				<FormField v-slot="{ value, handleChange }" name="hideBirthday">
					<FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
						<div class="space-y-0.5">
							<FormLabel class="text-base">
								Marketing emails
							</FormLabel>
							<FormDescription>
								Receive emails about new products, features, and more.
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