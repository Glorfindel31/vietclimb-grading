<script setup lang="ts">
const props = defineProps({
  // eslint-disable-next-line vue/require-default-prop
  link: Object,
  mobile: Boolean,
})
</script>

<template>
  <li v-if="props.link?.condition !== false">
    <Button variant="link" as-child>
      <NuxtLink :to="props.link?.to"> {{ link?.text }} </NuxtLink>
    </Button>
  </li>
</template>
