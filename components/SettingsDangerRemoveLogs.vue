<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import type { Database } from '~/types/supabase.type'

const supabase = useSupabaseClient<Database>()
const session = useSupabaseSession()
const formSchema = toTypedSchema(
  z.object({
    confirmation: z.literal('REMOVE LOGS'),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async values => {
  if (session.value) {
    const { error } = await supabase
      .from('top_records')
      .delete()
      .eq('UID_linked', session.value.user.id)
      .select('*')
    if (error) {
      console.error(error)
    } else {
      console.warn('Logs removed!')
    }
    console.warn('Form submitted!', values)
  }
})
</script>

<template>
  <div class="flex flex-row gap-4 rounded-lg border p-4">
    <div class="w-3/5">
      <h4 class="my-1 border-b py-1 text-2xl text-destructive">Remove logs</h4>
      <p class="text-sm italic text-muted-foreground">
        Want a fresh start, you can remove all of your ascents at once in here.
        But remember this is forever.
      </p>
    </div>
    <div class="flex w-2/5 items-center justify-end pl-4">
      <Dialog>
        <DialogTrigger as-child>
          <Button variant="destructive" class="w-full">Remove Logs</Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <form @submit="onSubmit">
            <DialogHeader>
              <DialogTitle class="text-destructive">
                Remove your logs
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
                  If you are sure, please type "REMOVE LOGS" in the following
                  field.
                </FormDescription>
                <FormMessage />
              </FormItem>
            </FormField>
            <DialogDescription hidden>
              If you are sure, please type "REMOVE LOGS" in the following field.
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
