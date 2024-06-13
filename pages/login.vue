<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { imageListLink, getRandomImage } from '~/helpers/image'

const supabase = useSupabaseClient()

const isLoading = ref(false)

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    password: z.string().min(8).max(50),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })
    if (data) {
      isLoading.value = false
      form.resetForm()
      navigateTo('/user')
    }
    if (error) {
      throw new Error('Error signing in:', error as Error)
    }
  }
  catch (error) {
    console.error(error)
  }
  finally {
    isLoading.value = false
  }
})

const index = getRandomImage()
</script>

<template>
  <div class="page-container">
    <div
      class="grid max-h-[80vh] max-w-7xl grid-rows-[20%,80%] justify-center overflow-hidden rounded-lg border align-middle sm:max-h-none sm:grid-cols-2 sm:grid-rows-none"
    >
      <div class="h-[80vh] w-auto">
        <NuxtImg
          class="h-full w-full object-cover object-top"
          :src="imageListLink[index].url"
          :alt="imageListLink[index].name"
        />
      </div>
      <div class="flex flex-col justify-center bg-background px-10">
        <h2>Login with email</h2>
        <form @submit="onSubmit">
          <FormField
            v-slot="{ componentField }"
            name="email"
          >
            <FormItem class="py-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="email@exemple.com"
                  v-bind="componentField"
                  auto-capitalize="none"
                  auto-complete="email"
                  auto-correct="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-slot="{ componentField }"
            name="password"
          >
            <FormItem class="py-2">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="********"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button
            type="submit"
            class="mt-4 w-full py-2"
          >
            Login
          </Button>
        </form>
        <div class="mt-4 text-sm text-primary">
          No Account yet?
          <NuxtLink
            to="/register"
            class="inline font-bold hover:underline"
          >Register</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
