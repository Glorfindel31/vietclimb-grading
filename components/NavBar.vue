<script setup lang="ts">
import { Icon } from '@iconify/vue'
import ToggleMode from './ToggleMode.vue'
const session = useSupabaseSession()
const adminENV = useRuntimeConfig().public.admin
const isAdmin = ref(false)
watchEffect(() => {
  isAdmin.value = adminENV === session.value?.user.id
})

const navLinks = computed(() => [
  { to: '/admin', text: 'Admin', condition: isAdmin.value },
  { to: '/about', text: 'About' },
  { to: '/public', text: 'Public Stats' },
  { to: '/dashboard', text: 'Dashboard' },
])
</script>

<template>
  <!-- Desktop Nav -->
  <div
    class="hidden min-w-full flex-row items-center justify-between p-2 sm:flex"
  >
    <ul>
      <li>
        <NuxtLink to="/">
          <img
            src="/logo-light.svg"
            alt="logo"
            class="block h-6 w-6 dark:hidden"
          />
          <img
            src="/logo-dark.svg"
            alt="logo"
            class="hidden h-6 w-6 dark:block"
          />
        </NuxtLink>
      </li>
    </ul>
    <ul class="flex flex-row gap-4">
      <NavLink v-for="link in navLinks" :key="link.to" :link="link" />
      <UserNav v-if="session?.user" />
      <PublicNav v-else />
      <li>
        <ToggleMode />
      </li>
    </ul>
  </div>
  <!-- Mobile Nav -->
  <div class="flex min-w-full flex-row justify-between sm:hidden">
    <ul class="flex items-center justify-center">
      <li>
        <NuxtLink to="/">
          <img
            src="/logo-light.svg"
            alt="logo"
            class="block h-6 w-6 dark:hidden"
          />
          <img
            src="/logo-dark.svg"
            alt="logo"
            class="hidden h-6 w-6 dark:block"
          />
        </NuxtLink>
      </li>
    </ul>
    <ul class="jus flex flex-row gap-2">
      <li>
        <ToggleMode />
      </li>
      <li>
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="ghost" size="icon">
              <Icon
                icon="radix-icons:hamburger-menu"
                class="h-[1.2rem] w-[1rem]"
              />
            </Button>
          </SheetTrigger>
          <SheetContent side="top">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription hidden> Navigation menu </SheetDescription>
            </SheetHeader>
            <ul class="flex flex-col justify-center gap-2">
              <SheetClose>
                <NavLink
                  v-for="link in navLinks"
                  :key="link.to"
                  :link="link"
                  mobile
                />
                <UserNav v-if="session?.user" class="text-md" mobile />
                <PublicNav v-else class="text-md" mobile />
              </SheetClose>
            </ul>
          </SheetContent>
        </Sheet>
      </li>
    </ul>
  </div>
</template>
