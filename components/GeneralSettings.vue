<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { useForm } from 'vee-validate'
import { Loader2 } from 'lucide-vue-next'
import { useToast } from './ui/toast'

import type { Tables, Database } from '~/types/supabase.type'

type UserDataType = Tables<'users'>

const supabase = useSupabaseClient<Database>()
const isUpdating = ref(false)
const { toast } = useToast()

const props = defineProps<{
  userData?: UserDataType | null
  refresh: () => void
}>()

const ape_index = ref(0)

const generalSetting = toTypedSchema(
  z.object({
    displayName: z
      .string()
      .regex(/^[a-zA-Z0-9\p{Emoji}]+$/u)
      .min(3)
      .max(50),
    height: z
      .number()
      .positive()
      .gte(100, 'Height must be greater than 100 cm')
      .lte(300, 'Height must be less than 300 cm')
      .optional(),
    arms: z
      .number()
      .positive()
      .gte(100, 'Arms must be greater than 100 cm')
      .lte(300, 'Arms must be less than 300 cm')
      .optional(),
    birthdate: z
      .string()
      .refine(v => v, { message: 'A date of birth is required.' }),
  }),
)

const {
  handleSubmit: handleSubmitGeneral,
  setFieldValue,
  values,
} = useForm({
  validationSchema: generalSetting,
})

setFieldValue(
  'displayName',
  props.userData?.displayed_name ? props.userData.displayed_name : undefined,
)
setFieldValue('height', props.userData?.height ?? undefined)
setFieldValue('arms', props.userData?.arms ?? undefined)
setFieldValue('birthdate', props.userData?.birthdate ?? undefined)

const onSubmitGeneral = handleSubmitGeneral(async values => {
  if (!props.userData?.UID)
    throw new Error('No user data found, Cant update user data.')
  if (
    values.height === props.userData?.height &&
    values.arms === props.userData?.arms &&
    values.displayName === props.userData?.displayed_name &&
    values.birthdate === props.userData?.birthdate
  ) {
    toast({
      title: 'You have no changes to save  🤷‍♂️',
      description: 'Try to change something first ? 🤔',
      variant: 'destructive',
    })
    return
  }
  isUpdating.value = true
  const { data, error } = await supabase
    .from('users')
    .update({
      displayed_name: values.displayName,
      height: values.height,
      arms: values.arms,
      birthdate: values.birthdate,
    })
    .eq('UID', props.userData?.UID)
    .select()
  if (data) {
    props.refresh()
    isUpdating.value = false
    const now = new Date()
    toast({
      title: 'Your profile has been updated ✅',
      description: `updated at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} - ${now.getDate()}:${now.getMonth() + 1}:${now.getFullYear()}`,
    })
  } else {
    useForm().resetForm()
    props.refresh()
    isUpdating.value = false
    const now = new Date()
    toast({
      title: "Your profile wasn't updated ❌",
      description: `An error occurred at 
								${now.getHours()}:
								${now.getMinutes()}:
								${now.getSeconds()} - 
								${now.getDate()}:
								${now.getMonth() + 1}:
								${now.getFullYear()} 
								Error message: ${error}`,
      variant: 'destructive',
    })
  }
})

watch(
  values,
  newValues => {
    ape_index.value =
      newValues.arms && newValues.height ? newValues.arms - newValues.height : 0
  },
  { deep: true },
)

ape_index.value = values.arms && values.height ? values.arms - values.height : 0
</script>

<template>
  <div
    class="flex max-w-[1400px] flex-col gap-4 rounded-lg border bg-background p-8"
  >
    <div class="flex flex-col">
      <h3 class="m-0 p-0 pb-8 font-thin">General Settings</h3>

      <form
        class="flex flex-col gap-4 lg:justify-between lg:gap-0"
        @submit="onSubmitGeneral"
      >
        <FormField v-slot="{ componentField }" name="displayName">
          <FormItem class="flex flex-row items-center gap-2 space-y-0 p-2">
            <div class="flex w-full flex-col gap-2">
              <FormLabel class="text-md font-bold"> UserName </FormLabel>
              <FormDescription>
                Your name will be displayed to other users.
              </FormDescription>
            </div>
            <div class="flex w-80 flex-col">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Displayed Name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage class="pl-2 pt-2" />
            </div>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="height">
          <FormItem class="flex flex-row items-center gap-4 space-y-0 p-2">
            <div class="flex w-full flex-col gap-2">
              <FormLabel class="text-md font-bold"> Height </FormLabel>
              <FormDescription>
                Your height will be displayed to other users in cm and used to
                compute your ape index.
              </FormDescription>
            </div>
            <div class="flex w-80 flex-col">
              <FormControl>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Height in cm"
                    v-bind="componentField"
                  />
                </FormControl>
              </FormControl>
              <FormMessage class="pl-2 pt-2" />
            </div>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="arms">
          <FormItem
            class="flex flex-row items-center justify-between gap-4 space-y-0 p-2"
          >
            <div class="flex w-full flex-col gap-2">
              <FormLabel class="text-md font-bold"> Arms length </FormLabel>
              <FormDescription>
                Your arms length will be displayed to other users in cm and used
                to compute your ape index. (Both arms in a T pose measured from
                finger to finger).
              </FormDescription>
            </div>
            <div class="flex w-80 flex-col">
              <FormControl>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Arms length in cm"
                    v-bind="componentField"
                  />
                </FormControl>
              </FormControl>
            </div>
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="birthdate">
          <FormItem class="flex flex-row items-center gap-4 space-y-0 p-2">
            <div class="flex w-full flex-col gap-2">
              <FormLabel class="text-md font-bold"> birthdate </FormLabel>
              <FormDescription>
                Your birthdate will be displayed to other users.
              </FormDescription>
            </div>
            <div class="flex w-80 flex-col">
              <FormControl>
                <FormControl>
                  <Input
                    type="date"
                    placeholder="Arms length in cm"
                    v-bind="componentField"
                  />
                </FormControl>
              </FormControl>
            </div>
          </FormItem>
        </FormField>

        <div
          class="flex w-full flex-row items-center justify-between rounded-lg border p-4 md:mb-2"
        >
          <div class="m-0 flex flex-col justify-between">
            <span class="text-md font-bold">Ape Index</span>
            <span class="w-1/2 text-sm text-muted-foreground">
              Your Ape index is the relational size between your arms size and
              your height. It can be positive or negative</span
            >
          </div>
          <span
            class="flex h-10 w-10 items-center justify-center text-2xl font-bold"
            >{{ ape_index }}</span
          >
        </div>
        <Button type="submit" class="w-24" :disabled="isUpdating">
          <Loader2 v-if="isUpdating" class="mr-2 h-4 w-4 animate-spin" />
          Save
        </Button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
