<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { Loader2 } from 'lucide-vue-next'
import type { Database } from '~/types/supabase.type'

import { imageListLink, getRandomImage } from '~/helpers/image'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/ban-types
    confetti: Function
  }
}

const client = useSupabaseClient<Database>()

const isLoading = ref(false)
const isRegisterDialogOpen = ref(false)
const isSignUpSuccess = ref(false)
const username = ref('')
const errorMessage = ref('Ya une erreur mec reveil toi')

const formSchema = toTypedSchema(
  z.object({
    email: z.string().email(),
    username: z.string().min(2).max(50),
    password: z.string().min(8).max(50),
    confirmPassword: z.string().min(8).max(50),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async values => {
  try {
    isLoading.value = true
    isRegisterDialogOpen.value = false

    const { data: signUpData, error: signUpError } = await client.auth.signUp({
      email: values.email,
      password: values.password,
    })

    if (signUpError) {
      console.error('Error signing up:', signUpError.message)
      isRegisterDialogOpen.value = true
      errorMessage.value = signUpError.message
      return
    }

    if (signUpData) {
      username.value = values.username
      isRegisterDialogOpen.value = true
      isSignUpSuccess.value = true
      form.resetForm()
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      const { error } = await client.from('users').insert([
        {
          email: values.email,
          displayed_name: values.username,
          UID: signUpData.user?.id as string,
        },
      ])

      if (error) {
        throw error
      }
    }
  } catch (error) {
    console.error('Error:', (error as Error).message)
  } finally {
    isLoading.value = false
  }
})

const index = getRandomImage()
</script>

<template>
  <ClientOnly>
    <div class="page-container" :class="{ 'blur-sm': isRegisterDialogOpen }">
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
          <h2 class="mb-6">Email Registration</h2>
          <form class="flex flex-col gap-2" @submit="onSubmit">
            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Username"
                    v-bind="componentField"
                    :disabled="isLoading"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@exemple.com"
                    v-bind="componentField"
                    :disabled="isLoading"
                    auto-capitalize="none"
                    auto-complete="email"
                    auto-correct="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    v-bind="componentField"
                    :disabled="isLoading"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="confirmPassword">
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="********"
                    v-bind="componentField"
                    :disabled="isLoading"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button type="submit" class="mt-4 w-full" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Register
            </Button>
          </form>
          <div class="mt-4 text-sm text-primary">
            Already have an account?
            <NuxtLink to="/login" class="inline font-bold hover:underline"
              >Login</NuxtLink
            >
          </div>
        </div>
        <div>
          <RegistrationDialog
            :is-register-dialog-open="isRegisterDialogOpen"
            :username="username"
            :error-message="errorMessage"
            :is-sign-up-success="isSignUpSuccess"
            @update:is-register-dialog-open="
              (value: boolean) => (isRegisterDialogOpen = value)
            "
          />
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped></style>
