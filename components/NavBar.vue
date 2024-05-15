<script setup
        lang="ts">
          import {
            NavigationMenu,
            NavigationMenuItem,
            NavigationMenuList,
            navigationMenuTriggerStyle
          } from '@/components/ui/navigation-menu';
          import ToggleMode from './ToggleMode.vue';
</script>

<template>
  <ClientOnly>
    <NavigationMenu class="flex flex-row justify-between min-w-full">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NuxtLink to="/">
            <NavigationMenuLink :class="navigationMenuTriggerStyle()">
              <img src="/logo-light.svg" alt="logo" class="w-6 h-6 dark:hidden block" />
              <img src="/logo-dark.svg" alt="logo" class="w-6 h-6 dark:block hidden" />
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NuxtLink to="/about">
            <NavigationMenuLink :class="navigationMenuTriggerStyle()">
              About
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NuxtLink to="/public">
            <NavigationMenuLink :class="navigationMenuTriggerStyle()">
              Public Stats
            </NavigationMenuLink>
          </NuxtLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button as-child>
            <NuxtLink to="/register">
              Register
            </NuxtLink>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Button as-child variant="secondary">
            <NuxtLink to="/login">
              Login
            </NuxtLink>
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <ToggleMode />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </ClientOnly>
</template>
