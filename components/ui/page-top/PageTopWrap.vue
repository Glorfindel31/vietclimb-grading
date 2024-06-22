<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  class: {},
})
</script>

<template>
  <div
    :class="
      cn(
        'my-6 flex flex-row items-center justify-between border-b py-2',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
