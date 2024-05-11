<script setup lang="ts">
          import {
                    NavigationMenu,
                    NavigationMenuItem,
                    NavigationMenuList,
                    navigationMenuTriggerStyle
          } from '@/components/ui/navigation-menu';
          import ToggleMode from './ToggleMode.vue';
</script>

<template>
          <div>
                    <ClientOnly>
                              <NavigationMenu>
                                        <NavigationMenuList>
                                                  <NavigationMenuItem>
                                                            <NuxtLink to="/">
                                                                      <NavigationMenuLink
                                                                                :class="navigationMenuTriggerStyle()">
                                                                                <img src="/logo.svg" alt="logo"
                                                                                          class="w-6 h-6" />
                                                                      </NavigationMenuLink>
                                                            </NuxtLink>
                                                  </NavigationMenuItem>
                                                  <NavigationMenuItem>
                                                            <NuxtLink to="/">
                                                                      <NavigationMenuLink
                                                                                :class="navigationMenuTriggerStyle()">
                                                                                About
                                                                      </NavigationMenuLink>
                                                            </NuxtLink>
                                                  </NavigationMenuItem>
                                                  <NavigationMenuItem>
                                                            <NuxtLink to="/">
                                                                      <NavigationMenuLink
                                                                                :class="navigationMenuTriggerStyle()">
                                                                                Public Stats
                                                                      </NavigationMenuLink>
                                                            </NuxtLink>
                                                  </NavigationMenuItem>
                                                  <NavigationMenuItem>
                                                            <ToggleMode />
                                                  </NavigationMenuItem>
                                        </NavigationMenuList>
                              </NavigationMenu>
                    </ClientOnly>
          </div>
</template>
