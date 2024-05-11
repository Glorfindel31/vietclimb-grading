<script setup lang="ts">
          import NavBar from '@/components/ui/navBar/NavBar.vue'
</script>

<template>
          <main
                    class="w-screen h-screen bg-gradient-to-t from-primary from-0% to-background to-50% flex flex-col justify-between">
                    <div class=" bg-background w-full p-2 border">
                              <NavBar />
                    </div>
                    <div>
                              <slot />
                    </div>
                    <footer class="flex justify-center p-2">
                              <p>Copyright Cedric Florentin & Vietclimb 2024</p>
                    </footer>
          </main>

</template>
