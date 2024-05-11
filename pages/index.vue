<script setup lang="ts">
          import { Button } from '@/components/ui/button'
</script>

<template>
          <div class="flex flex-col items-center justify-center h-full w-full p-10">
                    <div class="border rounded-lg p-10 shadow-lg bg-background flex flex-col gap-8 h-full">
                              <h1 class=" text-6xl">Vietclimb Route Map</h1>
                              <p>Follow grades by zone in the gym with ease. Log your ascents, track your
                                        progress, and
                                        rate your favorite routes.<br>
                                        View charts in your profile that show the grades you've completed most
                                        frequently and other climbing stats. <br>
                                        This will help you visualize your climbing journey and set new goals.
                                        Register now and embark on a new climbing adventure at Vietclimb.</p>
                              <div class="flex flex-row-reverse gap-4">
                                        <Button variant="secondary">View Stats</Button>
                                        <Button>Register</Button>
                              </div>
                    </div>
          </div>
</template>
