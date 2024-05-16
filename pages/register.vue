<script setup
        lang="ts">

          declare global {
            interface Window {
              confetti: any; // replace 'any' with the actual type if you know it
            }
          }
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

          import {
            Dialog,
            DialogContent,
            DialogFooter,
            DialogHeader,
            DialogTitle,
          } from '@/components/ui/dialog'

          import { Loader2 } from 'lucide-vue-next'

          import { Input } from '@/components/ui/input'

          import { Button } from '@/components/ui/button'
          import { imageListLink } from '~/assets/image'

          const client = useSupabaseClient()

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


          const onSubmit = form.handleSubmit((values) => {
            isLoading.value = true;
            isDialogOpen.value = false;

            (async () => {
              const { data, error } = await client.auth.signUp({
                email: values.email,
                password: values.password,
              })

              if (error) {
                console.error('Error signing up:', error.message)
                isDialogOpen.value = true;
                errorMessage.value = error.message
              }
              if (data) {
                username.value = values.username
                isDialogOpen.value = true;
                isSignUpSuccess.value = true;
                form.resetForm()
                window.confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 }
                });
              }
              isLoading.value = false
            })()
          })

          const googleButtonHandler = () => {
            isDialogOpen.value = true;
            isSignUpSuccess.value = true;
            window.confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 }
            });
            console.log('Google button clicked')
          }

          const moreConfetti = () => {
            const duration = 10 * 500;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 200 };

            function randomInRange(min: number, max: number) {
              return Math.random() * (max - min) + min;
            }

            const interval = setInterval(() => {
              const timeLeft = animationEnd - Date.now();

              if (timeLeft <= 0) {
                clearInterval(interval);
                return;
              }

              const particleCount = 50 * (timeLeft / duration);
              // since particles fall down, start a bit higher than random
              window.confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
              window.confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
            }, 250);
          }


          const getRandomImage = () => {
            const randomIndex = Math.floor(Math.random() * imageListLink.length)
            return randomIndex
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
        <!--Dialog success-->
        <Dialog v-if="isSignUpSuccess" v-model:open="isDialogOpen">
          <DialogContent class="max-w-[600px]">
            <DialogHeader>
              <DialogTitle class="text-2xl text-center leading-loose"><span
                  class="text-center font-bold italic text-primary text-5xl">Success
                  !</span> <br> Thanks for signing up <span class="font-bold capitalize">{{ username }}</span> !
              </DialogTitle>
            </DialogHeader>
            <div class="flex flex-col gap-4 py-8">
              <span class="text-center">Please verify your email address to get access to your account</span>
              <span class="text-center font-thin italic">Thank you from <span
                  class="text-center font-bold italic text-primary">Vietclimb team</span>, with love and finger injuries
                free
                wishes.</span>
              <span class="text-muted text-sm italic text-center">More confetti? we got you! <button class="underline"
                  @click="moreConfetti">click here</button></span>
            </div>
            <DialogFooter>
              <Button class="w-full" as-child>
                <NuxtLink to="/login">Go to Login</NuxtLink>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <!--Dialog Error-->
        <Dialog v-else v-model:open="isDialogOpen">
          <DialogContent class="max-w-[600px]">
            <DialogHeader>
              <DialogTitle class="text-2xl text-center leading-loose"><span
                  class="text-center font-bold italic text-destructive text-5xl">ERROR
                  !</span> <br> Please try Again</DialogTitle>
            </DialogHeader>
            <div class="flex flex-col gap-4 py-8">
              <span class="text-center">{{ errorMessage }}</span>
              <span class="text-center font-thin italic">Thank you for trying! Never give up! Try
                again!!!</span>
            </div>
            <DialogFooter>
              <Button class="w-full" as-child>
                <NuxtLink to="/login">Go to Login</NuxtLink>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  </div>

</template>

<style scoped></style>