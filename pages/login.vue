<script setup
		lang="ts">
			import { useForm } from 'vee-validate'
			import { toTypedSchema } from '@vee-validate/zod'
			import * as z from 'zod'

			import {
				FormControl,
				FormField,
				FormItem,
				FormLabel,
				FormMessage
			} from '@/components/ui/form'
			import { Input } from '@/components/ui/input'
			import { Button } from '@/components/ui/button'
			import { imageListLink, getRandomImage } from '~/assets/image'

			const supabase = useSupabaseClient()
			const isLoading = ref(false)

			const formSchema = toTypedSchema(z.object({
				email: z.string().email(),
				password: z.string().min(8).max(50),
			}));

			const form = useForm({
				validationSchema: formSchema
			})

			const onSubmit = form.handleSubmit(async (values) => {
				isLoading.value = true;
				try {
					const { data, error } = await supabase.auth.signInWithPassword({
						email: values.email,
						password: values.password
					})
					if (data) {
						isLoading.value = false;
						form.resetForm()
						navigateTo('/user')
					}
					if (error) {
						throw new Error('Error signing in:', error as any);
					}
				} catch (error) {
					console.error(error)
				} finally {
					isLoading.value = false;
				}
			})

			const index = getRandomImage()
</script>

<template>
	<div class="flex flex-col items-center justify-center min-h-full min-w-full p-8">
		<div
			class="grid grid-cols-2  align-middle justify-center shadow-lg dark:border rounded-lg overflow-hidden max-w-7xl">
			<div class="w-auto  h-[80vh]">
				<NuxtImg class="h-full w-full object-cover object-top" :src="imageListLink[index].url"
					:alt="imageListLink[index].name" />
			</div>
			<div class="flex flex-col justify-center px-10 bg-background">
				<h2>Login with email</h2>
				<form @submit="onSubmit">
					<FormField v-slot="{ componentField }" name="email">
						<FormItem class="py-2">
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="email@exemple.com" v-bind="componentField"
									auto-capitalize="none" auto-complete="email" auto-correct="off" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="password">
						<FormItem class="py-2">
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="********" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<Button type="submit" class="py-2 w-full mt-4">
						Login
					</Button>
				</form>
				<div class="text-primary text-sm mt-4">No Account yet?
					<NuxtLink to="/register" class="hover:underline font-bold inline">Register</NuxtLink>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
