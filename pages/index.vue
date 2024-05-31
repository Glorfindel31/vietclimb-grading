<script setup
		lang="ts">
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
	<div class="flex flex-col items-center justify-center min-h-full min-w-full p-8">
		<div
			class="grid grid-rows-[20%,80%]  align-middle justify-center border rounded-lg overflow-hidden max-w-7xl max-h-[80vh] sm:grid-rows-none sm:grid-cols-2 sm:max-h-none">
			<div class="w-auto  h-auto sm:h-[80vh]">
				<NuxtImg class="h-full w-full object-cover object-center sm:object-top" :src="imageListLink[index].url"
					:alt="imageListLink[index].name" />
			</div>
			<div class="flex flex-col justify-center px-10">
				<h1 class="text-2xl font-semibold sm:text-4xl">
					<span class="text-primary text-3xl font-bold sm:text-6xl xl:text-8xl">Vietclimb</span> <br>
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
				<div class="flex flex-row-reverse gap-4 pt-4">
					<Button variant="secondary" as-child>
						<NuxtLink to="/public">
							View Stats
						</NuxtLink>
					</Button>
					<Button v-if="user" as-child>
						<NuxtLink to="/user">Your Profil</NuxtLink>
					</Button>
					<Button v-else as-child>
						<NuxtLink to="/register">Register</NuxtLink>
					</Button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
