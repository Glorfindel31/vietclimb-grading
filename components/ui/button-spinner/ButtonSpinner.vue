<script setup lang="ts">
import { ReloadIcon } from '@radix-icons/vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  variant?:
    | 'default'
    | 'link'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | null
    | undefined
  size?: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | null | undefined
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  class: {},
  size: 'default',
  variant: 'default',
})
</script>

<template>
  <Button
    disabled
    :class="cn(props.class)"
    :size="props.size"
    :variant="props.variant"
  >
    <ReloadIcon class="mr-2 h-4 w-4 animate-spin" />
    Please wait
  </Button>
</template>
