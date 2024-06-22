<script setup lang="ts">
import { Icon } from '@iconify/vue/dist/iconify.js'
import type { Tables } from '~/types/supabase.type'

definePageMeta({
  middleware: ['auth'],
  //ormiddleware:'auth'
})

type UserDataType = Tables<'users'>

const { data, refresh } = await useAsyncData('userData', async () => {
  const session = useSupabaseSession()
  const supabase = useSupabaseClient()
  if (!session.value) return
  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('UID', session.value.user.id)
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
      <PageTopWrap>
        <PageTopTitle>Configuration and Settings</PageTopTitle>
        <PageTopBtnWraps>
          <Button size="icon" variant="ghost" as-child>
            <NuxtLink to="/user">
              <Icon icon="radix-icons:chevron-left" class="h-6 w-6" />
            </NuxtLink>
          </Button>
        </PageTopBtnWraps>
      </PageTopWrap>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GeneralSettings :user-data="userData" :refresh="refresh" />
        <PrivacySettings :user-data="userData" :refresh="refresh" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
