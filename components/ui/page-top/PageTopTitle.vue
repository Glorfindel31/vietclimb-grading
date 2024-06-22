<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: {},
  subtitle: '',
})
</script>

<template>
  <div v-if="subtitle">
    <h1 :class="cn('text-2xl sm:text-4xl', props.class)">
      <slot />
    </h1>
    <p class="max-w-84 text-sm italic sm:max-w-none">
      {{ props.subtitle }}
    </p>
  </div>
  <h1 v-else :class="cn('text-2xl sm:text-4xl', props.class)">
    <slot />
  </h1>
</template>
