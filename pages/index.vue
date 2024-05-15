<script setup
        lang="ts">
          import { Button } from '@/components/ui/button'
          import { imageListLink } from '~/assets/image'

          const getRandomImage = () => {
            const randomIndex = Math.floor(Math.random() * imageListLink.length)
            return randomIndex
          }
          const index = getRandomImage()

</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-full min-w-full p-8">
    <div class="grid grid-cols-2  align-middle justify-center border rounded-lg overflow-hidden max-w-7xl">
      <div class="w-auto  h-[80vh]">
        <NuxtImg class="h-full w-full object-cover object-top" :src="imageListLink[index].url"
          :alt="imageListLink[index].name" />
      </div>
      <div class="flex flex-col justify-center px-10">
        <h1 class="text-6xl font-semibold">
          <span class="text-primary text-8xl font-bold">Vietclimb</span> <br>
          Route Map
        </h1>
        <p>
          Follow grades by zone in the gym with ease. Log your ascents, track your
          progress, and
          rate your favorite routes.<br>
          View charts in your profile that show the grades you've completed most
          frequently and other climbing stats. <br>
          This will help you visualize your climbing journey and set new goals.
          Register now and embark on a new climbing adventure at Vietclimb.
        </p>
        <ClientOnly>
          <div class="flex flex-row-reverse gap-4 pt-4">
            <Button variant="secondary" as-child>
              <NuxtLink to="/public">
                View Stats
              </NuxtLink>
            </Button>
            <Button as-child>
              <NuxtLink to="/register">Register</NuxtLink>
            </Button>
          </div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
