<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

const formSchema = toTypedSchema(
  z.object({
    confirmation: z.literal('DELETE ACCOUNT'),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(values => {
  console.warn('Form submitted!', values)
})
</script>

<template>
  <div class="flex flex-row gap-4 rounded-lg border p-4">
    <div class="w-3/5">
      <h4 class="my-1 border-b py-1 text-2xl text-destructive">
        Delete Account
      </h4>
      <p class="text-sm italic text-muted-foreground">
        Think about this, do you really want to remove your account? This can't
        be undone.
      </p>
    </div>
    <div class="flex w-2/5 items-center justify-end pl-4">
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="destructive" class="w-full">Delete Account</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <form @submit="onSubmit">
            <DialogHeader>
              <DialogTitle class="text-destructive">
                Delete your account
              </DialogTitle>
            </DialogHeader>
            <FormField v-slot="{ componentField }" name="confirmation">
              <FormItem class="py-8">
                <FormLabel class="text-foreground">
                  Enter the following words to confirm and click on confirm
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Type here"
                    v-bind="componentField"
                    class="col-span-3"
                  />
                </FormControl>
                <FormDescription>
                  If you are sure, please type "DELETE ACCOUNT" in the following
                  field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
            <DialogDescription hidden>
              If you are sure, please type "DELETE ACCOUNT" in the following
              field.
            </DialogDescription>
            <DialogFooter>
              <Button type="submit" variant="destructive">Confirm</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>
