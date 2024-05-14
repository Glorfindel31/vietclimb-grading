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

          import {
            Card,
            CardContent,
            CardFooter,
            CardHeader,
            CardTitle
          } from '@/components/ui/card'

          const formSchema = toTypedSchema(z.object({
            email: z.string().email(),
            password: z.string().min(8).max(50),
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
          <Button type="submit" class="py-2">
            Login
          </Button>
        </form>
      </CardContent>
      <CardFooter class="py-4 flex flex-row justify-between">
        No Account yet?
        <Button as-child variant="secondary">
          <NuxtLink to="/register">Register now</NuxtLink>
        </Button>
      </CardFooter>
    </Card>
  </ClientOnly>
</template>

<style scoped></style>
