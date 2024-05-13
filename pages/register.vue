<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

const formSchema = toTypedSchema(z.object({
  email: z.string().email(), 
  username: z.string().min(2).max(50),
  password: z.string().min(8).max(50),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
})
</script>

<template>
  <form @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="username">
      <FormItem>
        <FormLabel>Username</FormLabel>
        <FormControl>
          <Input type="text" placeholder="shadcn" v-bind="componentField" />
        </FormControl>
        <FormDescription>
          This is your public display name.
        </FormDescription>
        <FormMessage />
      </FormItem>
      <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input type="email" placeholder="email@exemple.com" v-bind="componentField" />
          </FormControl>
          <FormMessage />
      </FormItem>
          <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                    <Input type="password" placeholder="********" v-bind="componentField" />
              </FormControl>
              <FormMessage />
          </FormItem>
    </FormField>
    <Button type="submit">
      Register
    </Button>
  </form>
</template>

<style scoped>

</style>