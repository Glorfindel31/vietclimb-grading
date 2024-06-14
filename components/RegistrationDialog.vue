<script setup lang="ts">
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/ban-types
    confetti: Function
  }
}
const emit = defineEmits(['update:isRegisterDialogOpen'])
const props = defineProps({
  isSignUpSuccess: Boolean,
  isRegisterDialogOpen: Boolean,
  username: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String,
    default: '',
  },
})

const moreConfetti = () => {
  const duration = 10 * 500
  const animationEnd = Date.now() + duration
  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 200,
  }

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now()

    if (timeLeft <= 0) {
      clearInterval(interval)
      return
    }

    const particleCount = 50 * (timeLeft / duration)
    // since particles fall down, start a bit higher than random
    window.confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    })
    window.confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    })
  }, 250)
}
</script>

<template>
  <ClientOnly>
    <Dialog
      v-if="props.isSignUpSuccess"
      :open="props.isRegisterDialogOpen"
      @update:open="value => emit('update:isRegisterDialogOpen', value)"
    >
      <DialogContent class="max-w-[600px]">
        <DialogHeader>
          <DialogTitle class="text-center text-2xl leading-loose">
            <span class="text-center text-5xl font-bold italic text-primary"
              >Success !</span
            >
            <br />
            Thanks for signing up
            <span class="font-bold capitalize">{{ props.username }}</span>
            !
          </DialogTitle>
        </DialogHeader>
        <div class="flex flex-col gap-4 py-8">
          <span class="text-center"
            >Please verify your email address to get access to your
            account</span
          >
          <span class="text-center font-thin italic"
            >Thank you from
            <span class="text-center font-bold italic text-primary"
              >Vietclimb team</span
            >, with love and finger injuries free wishes.</span
          >
          <span class="text-center text-sm italic text-muted"
            >More confetti? we got you!
            <button class="underline" @click="moreConfetti">
              click here
            </button></span
          >
        </div>
        <DialogFooter>
          <Button class="w-full" as-child>
            <NuxtLink to="/login"> Go to Login </NuxtLink>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    <!-- Dialog Error -->
    <Dialog
      v-else
      :open="props.isRegisterDialogOpen"
      @update:open="value => emit('update:isRegisterDialogOpen', value)"
    >
      <DialogContent class="max-w-[600px]">
        <DialogHeader>
          <DialogTitle class="text-center text-2xl leading-loose">
            <span class="text-center text-5xl font-bold italic text-destructive"
              >ERROR !</span
            >
            <br />
            Please try Again
          </DialogTitle>
        </DialogHeader>
        <div class="flex flex-col gap-4 py-8">
          <span class="text-center">{{ props.errorMessage }}</span>
          <span class="text-center font-thin italic"
            >Thank you for trying! Never give up! Try again!!!</span
          >
        </div>
        <DialogFooter>
          <Button class="w-full" as-child>
            <NuxtLink to="/login"> Go to Login </NuxtLink>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </ClientOnly>
</template>

<style scoped></style>
