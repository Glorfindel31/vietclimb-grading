<script setup lang="ts">
// import { Icon } from '@iconify/vue'
import type { UserListRecordsRoutes } from '~/types/dashboard.type'
import type { Database } from '~/types/supabase.type'
// import type {} from '@/types/userTable.type'
// import { useToast } from '@/components/ui/toast/use-toast'

const supabase = useSupabaseClient<Database>()

const { data } = await useAsyncData('topRecords', async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*,top_records (*,routes(*))')
  if (error) {
    console.error(error)
    return
  }
  return data as UserListRecordsRoutes[]
})

watchEffect(() => {})
</script>

<template>
  <div class="page-container">
    <div class="page-card gap-4">
      <h1>Dashboard</h1>
      <div v-if="data">
        <StatisticsOne :data="data" />
      </div>
    </div>
  </div>
</template>
