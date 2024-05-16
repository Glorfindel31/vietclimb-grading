<script setup
        lang="ts">
          import type { Database } from '~/database.types'
          declare global {
            interface Window {
              confetti: Function;
            }
          }
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

          import { Icon } from '@iconify/vue'
          import { Loader2 } from 'lucide-vue-next'

          import { Input } from '@/components/ui/input'

          import { Button } from '@/components/ui/button'
          import { imageListLink, getRandomImage } from '~/assets/image'

          const client = useSupabaseClient<Database>()

          let isLoading = ref(false)
          let isDialogOpen = ref(false)
          let isSignUpSuccess = ref(false)
          let username = ref('')
          let errorMessage = ref('Ya une erreur mec reveil toi')

          const formSchema = toTypedSchema(z.object({
            email: z.string().email(),
            username: z.string().min(2).max(50),
            password: z.string().min(8).max(50),
            confirmPassword: z.string().min(8).max(50)
          }));

          const form = useForm({
            validationSchema: formSchema
          })

          const onSubmit = form.handleSubmit(async (values) => {
            try {
              isLoading.value = true;
              isDialogOpen.value = false;

              const { data: signUpData, error: signUpError } = await client.auth.signUp({
                email: values.email,
                password: values.password,
              });

              if (signUpError) {
                console.error('Error signing up:', signUpError.message);
                isDialogOpen.value = true;
                errorMessage.value = signUpError.message;
                return;
              }

              if (signUpData) {
                username.value = values.username;
                isDialogOpen.value = true;
                isSignUpSuccess.value = true;
                form.resetForm();
                window.confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 }
                });

                const { data, error } = await client
                  .from('users')
                  .insert([{
                    email: values.email,
                    display_name: values.username,
                    UID: signUpData.user?.id as string
                  }]);

                if (error) {
                  throw error;
                }
              }
            } catch (error) {
              console.error('Error:', (error as Error).message);
            } finally {
              isLoading.value = false;
            }
          });

          const googleButtonHandler = () => {
            isDialogOpen.value = true;
            isSignUpSuccess.value = true;
            window.confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
          }
          const index = getRandomImage()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-full min-w-full p-8" :class="{ 'blur-sm': isDialogOpen }">
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
                  <Input type="text" placeholder="User Name" v-bind="componentField" :disabled="isLoading" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@exemple.com" v-bind="componentField" :disabled="isLoading"
                    auto-capitalize="none" auto-complete="email" auto-correct="off" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" v-bind="componentField" :disabled="isLoading" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="confirmPassword">
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" v-bind="componentField" :disabled="isLoading" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <Button type="submit" class="w-full mt-4" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
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
            <Button type="button" class="w-full mt-4" :disabled="isLoading" @click="googleButtonHandler">
              <Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
              <Icon icon="fa-brands:google" class="h-5 w-5 mx-2" />
              Register with Google
            </Button>
          </div>
          <div class="text-primary text-sm mt-4">Already have an account?
            <NuxtLink to="/login" class="hover:underline font-bold inline">Login</NuxtLink>
          </div>
        </ClientOnly>
      </div>
      <div>
        <RegistrationDialog :isDialogOpen="isDialogOpen" @update:isDialogOpen="value => isDialogOpen = value"
          :username="username" :errorMessage="errorMessage" :isSignUpSuccess="isSignUpSuccess" />
      </div>
    </div>
  </div>

</template>

<style scoped></style>