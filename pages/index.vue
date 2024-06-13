<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { imageListLink } from '~/helpers/image'

const user = useSupabaseUser()

const getRandomImage = () => {
  const randomIndex = Math.floor(Math.random() * imageListLink.length)
  return randomIndex
}
const index = getRandomImage()
</script>

<template>
  <div class="page-container px-1">
    <div
      class="grid max-h-[80vh] max-w-7xl grid-rows-[20%,80%] justify-center overflow-hidden rounded-lg border align-middle sm:max-h-none sm:grid-cols-2 sm:grid-rows-none"
    >
      <div class="h-auto w-auto sm:h-[80vh]">
        <NuxtImg
          class="h-full w-full object-cover object-center sm:object-top"
          :src="imageListLink[index].url"
          :alt="imageListLink[index].name"
        />
      </div>
      <div class="flex flex-col justify-center px-10">
        <h1 class="text-2xl font-semibold sm:text-4xl">
          <span
            class="text-3xl font-bold text-primary sm:text-6xl xl:text-8xl"
          >Vietclimb</span>
          Route Map
        </h1>
        <p>
          Follow grades by zone in the gym with ease. Log your
          ascents, track your progress, and rate your favorite
          routes.
        </p>
        <p>
          View charts in your profile that show the grades you've
          completed most frequently and other climbing stats.
        </p>
        <p>
          This will help you visualize your climbing journey and
          set new goals. Register now and embark on a new
          climbing adventure at Vietclimb.
        </p>
        <div class="flex flex-row-reverse gap-4 pt-4">
          <Button
            variant="secondary"
            as-child
          >
            <NuxtLink to="/public">
              View Stats
            </NuxtLink>
          </Button>
          <Button
            v-if="user"
            as-child
          >
            <NuxtLink to="/user">
              Your Profil
            </NuxtLink>
          </Button>
          <Button
            v-else
            as-child
          >
            <NuxtLink to="/register">
              Register
            </NuxtLink>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
