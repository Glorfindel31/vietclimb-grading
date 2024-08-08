<script setup lang="ts">
import confetti from 'canvas-confetti'

import { Icon } from '@iconify/vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import type { Database } from '~/types/supabase.type'
import {
  type UserWithTopRecords,
  type RouteDataType,
} from '@/types/userTable.type'
import { useToast } from '@/components/ui/toast/use-toast'
import { stringCompressor } from '~/helpers/helpFunctions'
import { congratsMessages } from '~/pages/user/CongratsMessages'

const { toast } = useToast()

const props = defineProps<{
  routeData: RouteDataType
  userData: UserWithTopRecords
  refresh: () => void
}>()

const supabase = useSupabaseClient<Database>()

const formSchema = toTypedSchema(
  z.object({
    isTop: z.boolean().refine(value => value === true, {
      message: 'You must have topped the route to submit a rating or a grade.',
    }),
    grade: z
      .number()
      .min(1)
      .max(7)
      .default(props.routeData.route_grade ? props.routeData.route_grade : 1),
    rate: z.enum(['1', '2', '3', '4', '5']).default('5'),
  }),
)

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async values => {
  const { grade, rate } = values
  const URID = props.routeData.URID
  const UID = props.userData.UID

  if (values.isTop && values.grade && values.rate && URID && UID) {
    const { data, error } = await supabase
      .from('top_records')
      .insert({
        URID_linked: URID,
        user_grade: grade,
        user_rate: Number(rate),
        UID_linked: UID,
        TUID: stringCompressor(URID + UID),
      })
      .select()
    if (data) {
      toast({
        title: 'Ascent logged',
        description:
          congratsMessages[Math.floor(Math.random() * congratsMessages.length)],
      })
      props.refresh()
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    } else {
      if (error.code === '23505') {
        toast({
          title: 'Ascent already logged',
          description: `You have already logged this ascent ${props.userData.displayed_name}!`,
        })
      } else {
        toast({
          title: 'Error',
          description: `There was an error logging the ascent ${props.userData.displayed_name}!`,
        })
      }
    }
  } else {
    toast({
      title: 'Error',
      description: `You must have topped the route to submit a rating or a grade.`,
    })
  }
})
</script>

<template>
  <ClientOnly>
    <form class="flex flex-col justify-center gap-2" @submit="onSubmit">
      <FormField v-slot="{ value, handleChange }" type="checkbox" name="isTop">
        <FormItem class="flex flex-col items-center justify-center gap-2">
          <div class="flex items-center justify-center gap-4">
            <FormControl>
              <Checkbox
                :checked="value"
                class="h-6 w-6"
                @update:checked="handleChange"
              />
            </FormControl>
            <FormLabel
              class="text-left text-lg font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Top Check
              <div class="pt-1 text-sm italic">
                Route can't be rated if not topped.
              </div>
            </FormLabel>
          </div>
          <FormMessage class="px-4 text-left text-xs" />
        </FormItem>
      </FormField>
      <FormField v-slot="{ componentField }" type="radio" name="rate">
        <div class="flex items-center justify-center text-center">
          <FormItem>
            <FormLabel class="text-lg">Rate the route</FormLabel>
            <FormControl>
              <RadioGroup
                class="flex flex-row space-x-1"
                v-bind="componentField"
              >
                <FormItem class="flex flex-col items-center gap-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="1" class="mb-1 h-6 w-6" />
                  </FormControl>
                  <FormLabel class="font-normal"> 1 </FormLabel>
                </FormItem>
                <FormItem class="flex flex-col items-center gap-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="2" class="mb-1 h-6 w-6" />
                  </FormControl>
                  <FormLabel class="font-normal"> 2 </FormLabel>
                </FormItem>
                <FormItem class="flex flex-col items-center gap-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="3" class="mb-1 h-6 w-6" />
                  </FormControl>
                  <FormLabel class="font-normal"> 3 </FormLabel>
                </FormItem>
                <FormItem class="flex flex-col items-center gap-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="4" class="mb-1 h-6 w-6" />
                  </FormControl>
                  <FormLabel class="font-normal"> 4 </FormLabel>
                </FormItem>
                <FormItem class="flex flex-col items-center gap-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="5" class="mb-1 h-6 w-6" />
                  </FormControl>
                  <FormLabel class="font-normal"> 5 </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>
      </FormField>
      <FormField name="grade">
        <FormItem
          class="flex w-24 flex-col items-center justify-center self-center"
        >
          <FormLabel class="text-lg">Grade</FormLabel>
          <NumberField
            :default-value="
              props.routeData.route_grade ? props.routeData.route_grade : 1
            "
            :min="1"
            :max="7"
            @update:model-value="
              v => {
                if (v) {
                  setFieldValue('grade', v)
                } else {
                  setFieldValue('grade', 1)
                }
              }
            "
          >
            <NumberFieldContent>
              <NumberFieldDecrement />
              <NumberFieldInput />
              <NumberFieldIncrement />
            </NumberFieldContent>
          </NumberField>
        </FormItem>
      </FormField>
      <DrawerClose as-child>
        <Button class="self-center" type="submit" variant="outline" size="icon">
          <Icon icon="radix-icons:check" class="h-6 w-6" />
        </Button>
      </DrawerClose>
    </form>
  </ClientOnly>
</template>

<style lang="css" scoped></style>
