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
  <div :class="cn('flex flex-row gap-2', props.class)">
    <slot />
  </div>
</template>
