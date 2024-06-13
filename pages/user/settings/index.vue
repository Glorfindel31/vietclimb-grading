<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import type { Tables } from '~/types/supabase.type'

definePageMeta({
  middleware: ['auth'],
  //ormiddleware:'auth'
})

type UserDataType = Tables<'users'>

const { data, refresh } = await useAsyncData('userData', async () => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()
  if (!user.value) return
  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('UID', user.value.id)
  if (error) {
    console.error(error)
    return
  }
  return userData[0]
})

const userData = ref<UserDataType | null>(null)
if (data.value) {
  userData.value = data.value
}
</script>

<template>
  <div class="page-container">
    <div class="page-card">
      <div class="flexw-fullflex-rowitems-centerjustify-betweenpy-8">
        <h1 class="text-2xl">ConfigurationandSettings</h1>
        <Button size="icon" variant="ghost" as-child>
          <NuxtLink to="/user">
            <Icon icon="radix-icons:chevron-left" class="h-6w-6" />
          </NuxtLink>
        </Button>
      </div>
      <div class="gridgrid-cols-1gap-4lg:grid-cols-2">
        <GeneralSettings :user-data="userData" :refresh="refresh" />
        <PrivacySetting s:user-data="userData" :refresh="refresh" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
