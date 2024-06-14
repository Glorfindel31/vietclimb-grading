<script setup lang="ts">
import { Icon } from '@iconify/vue'
import ToggleMode from './ToggleMode.vue'
import type { Database } from '~/types/supabase.type'

const adminENV = useRuntimeConfig().public.admin
const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const isAdmin = ref(adminENV === user.value?.id)

const logOutHandler = async () => {
  try {
    await client.auth.signOut()
    navigateTo('/')
  } catch (error) {
    console.error('Error logging out:', error as Error)
  }
}

watch(user, () => {
  isAdmin.value = adminENV === user.value?.id
})
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
      <li v-if="isAdmin">
        <Button variant="link" as-child>
          <NuxtLink to="/admin"> Admin </NuxtLink>
        </Button>
      </li>
      <li>
        <Button variant="link" as-child>
          <NuxtLink to="/about"> About </NuxtLink>
        </Button>
      </li>
      <li>
        <Button variant="link" as-child>
          <NuxtLink to="/public"> Public Stats </NuxtLink>
        </Button>
      </li>
      <li>
        <Button variant="link" as-child>
          <NuxtLink to="/dashboard"> Dashboard</NuxtLink>
        </Button>
      </li>
      <UserNav v-if="user" :log-out-handler="logOutHandler" />
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
                <li v-if="isAdmin">
                  <Button variant="link" as-child>
                    <NuxtLink to="/admin"> Admin </NuxtLink>
                  </Button>
                </li>
                <li>
                  <Button variant="link" as-child class="text-md">
                    <NuxtLink to="/about"> About </NuxtLink>
                  </Button>
                </li>
                <li>
                  <Button variant="link" as-child class="text-md">
                    <NuxtLink to="/public"> Public Stats </NuxtLink>
                  </Button>
                </li>
                <li>
                  <Button variant="link" as-child>
                    <NuxtLink to="/dashboard"> Dashboard</NuxtLink>
                  </Button>
                </li>
                <li>
                  <UserNav
                    v-if="user"
                    :log-out-handler="logOutHandler"
                    class="text-md"
                    mobile
                  />
                  <PublicNav v-else class="text-md" mobile />
                </li>
              </SheetClose>
            </ul>
          </SheetContent>
        </Sheet>
      </li>
    </ul>
  </div>
</template>
