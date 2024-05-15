<script setup
        lang="ts">
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

          import {
            Card,
            CardContent,
            CardFooter,
            CardHeader,
            CardTitle
          } from '@/components/ui/card'

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
            console.log('Form submitted!', values)
          })
</script>

<template>
  <ClientOnly>
    <Card class="max-w-96 mx-auto shadow-xl">
      <CardHeader>
        <CardTitle>
          Email Registration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit="onSubmit">
          <FormField v-slot="{ componentField }" name="username">
            <FormItem class="py-2">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="UserName" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem class="py-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@exemple.com" v-bind="componentField" />
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
          <FormField v-slot="{ componentField }" name="confirmPassword">
            <FormItem class="py-2">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <Button type="submit" class="py-2">
            Register
          </Button>
        </form>
      </CardContent>
      <CardFooter class="py-4 flex flex-row justify-between">
        Already have an account?
        <Button as-child variant="secondary">
          <NuxtLink to="/login">Login</NuxtLink>
        </Button>
      </CardFooter>
    </Card>
  </ClientOnly>
</template>

<style scoped></style>
