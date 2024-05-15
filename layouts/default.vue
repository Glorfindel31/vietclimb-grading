<script setup
        lang="ts">
          import NavBar from '~/components/NavBar.vue'
</script>

<template>
  <main
    class="w-screen min-h-screen bg-gradient-to-t from-primary from-0% to-background to-50% flex flex-col justify-between">
    <div class="bg-background min-w-full p-2 dark:border-b shadow-md">
      <NavBar />
    </div>
    <slot />
    <footer class="flex p-2 w-full">
      <p class="text-center w-full">Copyright Cedric Florentin & Vietclimb 2024</p>
    </footer>
  </main>
</template>
