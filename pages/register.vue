<script setup
        lang="ts">
          import { supabase } from '~/utils/supabase'
          import { useForm } from 'vee-validate'
          import { toTypedSchema } from '@vee-validate/zod'
          import * as z from 'zod'

          import { Icon } from '@iconify/vue'

          import {
            FormControl,
            FormField,
            FormItem,
            FormLabel,
            FormMessage
          } from '@/components/ui/form'

          import { Input } from '@/components/ui/input'

          import { Button } from '@/components/ui/button'

          const formSchema = toTypedSchema(z.object({
            email: z.string().email(),
            username: z.string().min(2).max(50),
            password: z.string().min(8).max(50),
            confirmPassword: z.string().min(8).max(50)
          }));

          const form = useForm({
            validationSchema: formSchema
          })

          const onSubmit = form.handleSubmit((values) => {
            (async () => {
              const { data, error } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
              })

              if (error) {
                console.error('Error signing up:', error.message)
                return
              }

              if (data.user) {
                const { error } = await supabase
                  .from('users')
                  .insert([
                    { id: data.user.id, email: data.user.email, display_name: values.username, role: 'user' },
                  ])

                if (error) {
                  console.error('Error inserting user:', error.message)
                }
              }
            })()
          })

          import { imageListLink } from '~/assets/image'

          const getRandomImage = () => {
            const randomIndex = Math.floor(Math.random() * imageListLink.length)
            return randomIndex
          }
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
        <ClientOnly>
          <h2 class="mb-6">Email Registration</h2>
          <form @submit="onSubmit" class="flex flex-col gap-2">
            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="User Name" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemple.com" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="confirmPassword">
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button type="submit" class="w-full mt-4">
              Register
            </Button>
          </form>
          <div class="my-4">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t" />
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button type="button" class="w-full mt-4">
              <Icon icon="fa-brands:google" class="h-5 w-5 mx-2" />
              Register with Google
            </Button>
          </div>
          <div class="text-primary text-sm mt-4">Already have an account?
            <NuxtLink to="/login" class="hover:underline font-bold inline">Login</NuxtLink>
          </div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<style scoped></style>