<script lang="ts" setup>
import type { HTMLAttributes, InjectionKey } from 'vue'
import { provide } from 'vue'
import { useId } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const id = useId()
provide(FORM_ITEM_INJECTION_KEY, id)
</script>

<script lang="ts">
export const FORM_ITEM_INJECTION_KEY = Symbol() as InjectionKey<string>
</script>

<template>
  <div :class="cn('space-y-2', props.class)">
    <slot />
  </div>
</template>
