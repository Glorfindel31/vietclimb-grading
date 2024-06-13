<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps<{
  rating: number
}>()
</script>

<template>
  <div class="flex flex-row gap-0">
    <Icon
      v-for="(n, index) in 5"
      :key="index"
      class="h-3 w-3"
      :icon="
        n <= props.rating
          ? 'radix-icons:star-filled'
          : 'radix-icons:star'
      "
    />
  </div>
</template>
