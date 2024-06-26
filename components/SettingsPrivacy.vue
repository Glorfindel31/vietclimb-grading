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

const props = defineProps<{
  userData?: UserDataType | null
  refresh: () => void
}>()

const { toast } = useToast()

const privacySetting = toTypedSchema(
  z.object({
    showBirthDate: z.boolean().default(true),
    showHeight: z.boolean().default(true),
    showArms: z.boolean().default(true),
    showRank: z.boolean().default(true),
    showTops: z.boolean().default(true),
    showName: z.boolean().default(true),
  }),
)

const privacyForm = [
  {
    name: 'showName',
    label: 'Name Visibility',
    description: 'Your name will be displayed to other users.',
  },
  {
    name: 'showBirthDate',
    label: 'BirthDate Visibility',
    description: 'Your birth date will be displayed to other users.',
  },
  {
    name: 'showHeight',
    label: 'Height Visibility',
    description: 'You can display your height or not.',
  },
  {
    name: 'showArms',
    label: 'Arms length Visibility',
    description: 'Your arms length will be displayed to other users.',
  },
  {
    name: 'showRank',
    label: 'Rank Visibility',
    description: 'You will appear in the ranking dashboard.',
  },
  {
    name: 'showTops',
    label: 'Tops Visibility',
    description: 'You can display or not your personal statistics.',
  },
]

const { handleSubmit: handleSubmitPrivacy, setFieldValue } = useForm({
  validationSchema: privacySetting,
})

setFieldValue('showName', props.userData?.show_name ?? true)
setFieldValue('showBirthDate', props.userData?.show_birthdate ?? true)
setFieldValue('showHeight', props.userData?.show_height ?? true)
setFieldValue('showArms', props.userData?.show_arms ?? true)
setFieldValue('showRank', props.userData?.show_rank ?? true)
setFieldValue('showTops', props.userData?.show_tops ?? true)

const onSubmitPrivacy = handleSubmitPrivacy(async values => {
  if (!props.userData?.UID)
    throw new Error('No user data found, Cant update user data.')
  if (
    values.showBirthDate === props.userData?.show_birthdate &&
    values.showHeight === props.userData?.show_height &&
    values.showArms === props.userData?.show_arms &&
    values.showRank === props.userData?.show_rank &&
    values.showTops === props.userData?.show_tops &&
    values.showName === props.userData?.show_name
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
      show_birthdate: values.showBirthDate,
      show_height: values.showHeight,
      show_arms: values.showArms,
      show_rank: values.showRank,
      show_tops: values.showTops,
      show_name: values.showName,
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
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Privacy Settings</CardTitle>
      <CardDescription>Irreversible</CardDescription>
    </CardHeader>
    <CardContent>
      <form
        class="flex h-full flex-col justify-between gap-4"
        @submit="onSubmitPrivacy"
      >
        <FormField
          v-for="field in privacyForm"
          v-slot="{ value, handleChange }"
          :key="field.name"
          :name="field.name"
        >
          <FormItem
            class="flex flex-row items-center justify-between rounded-lg border p-4"
          >
            <div class="space-y-0.5">
              <FormLabel class="text-base">
                {{ field.label }}
              </FormLabel>
              <FormDescription>
                {{ field.description }}
              </FormDescription>
            </div>
            <FormControl>
              <Switch :checked="value" @update:checked="handleChange" />
            </FormControl>
          </FormItem>
        </FormField>
        <Button type="submit" class="w-24" :disabled="isUpdating">
          <Loader2 v-if="isUpdating" class="mr-2 h-4 w-4 animate-spin" />
          Save
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
