<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    default: null,
  },
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div
    v-if="error"
    class="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-t from-primary from-0% to-background to-50%"
  >
    <div
      class="flex flex-col items-center justify-center gap-3 rounded-lg border bg-background px-36 py-20 shadow-lg"
    >
      <h1 class="mb-4 text-9xl">
        {{ error.statusCode }}
      </h1>
      <p class="text-lg italic">
        Oupps...
      </p>
      <p>{{ props.error }}</p>
      <p>{{ error.statusMessage }}</p>
      <Button @click="handleError">
        Let's get you back home...
      </Button>
    </div>
  </div>
</template>
