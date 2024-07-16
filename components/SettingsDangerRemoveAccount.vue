<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'

import { useToast } from '@/components/ui/toast/use-toast'

import type { Database } from '~/types/supabase.type'

const { toast } = useToast()
const isLoading = ref<boolean>(false)

const supabase = useSupabaseClient<Database>()
const session = useSupabaseSession()

const formSchema = toTypedSchema(
  z.object({
    confirmation: z.literal('DELETE ACCOUNT'),
  }),
)

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit(async () => {
  if (session.value) {
    isLoading.value = true
    const { error: errorDB } = await supabase
      .from('users')
      .delete()
      .eq('UID', session.value?.user.id)
      .select('*')

    const { error: errorLogout } = await supabase.auth.signOut()

    if (errorDB || errorLogout) {
      toast({
        title: 'Account not removed',
        description: 'There was an error removing your account.',
      })
      console.error(errorDB, errorLogout)
      isLoading.value = false
    } else {
      isLoading.value = false
      navigateTo('/')
      toast({
        title: 'Account removed',
        description: 'Your account has been removed.',
      })
    }
  }
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
              <Button
                type="submit"
                variant="destructive"
                :class="isLoading ? 'hidden' : 'block'"
                >Confirm</Button
              >
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  </div>
</template>
