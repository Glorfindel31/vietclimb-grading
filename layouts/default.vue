<script setup lang="ts"></script>

<template>
  <main
    id="app"
    vaul-drawer-wrapper
    class="flex min-h-screen w-screen flex-col justify-between bg-gradient-to-t from-primary from-0% to-background to-50%"
  >
    <NuxtLoadingIndicator
      :throttle="0"
      :height="3"
      class="bg-gradient-to-l from-foreground to-primary"
      color="false"
    />
    <div class="min-w-full bg-background p-2 shadow-md dark:border-b">
      <NavBar />
    </div>
    <slot />
    <footer class="flex w-full p-2">
      <p class="w-full text-center">
        Copyright Cedric Florentin & Vietclimb 2024
      </p>
    </footer>
    <Toaster />
  </main>
</template>
