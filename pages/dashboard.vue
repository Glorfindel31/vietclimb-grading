<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { UserListRecordsRoutes } from '~/types/dashboard.type'
import type { Database } from '~/types/supabase.type'
// import type {} from '@/types/userTable.type'
// import { useToast } from '@/components/ui/toast/use-toast'

const supabase = useSupabaseClient<Database>()

const { data, refresh, status } = await useAsyncData('topRecords', async () => {
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
      <div class="flex flex-row justify-between">
        <h1>Dashboard</h1>
        <Button size="icon" variant="ghost" @click="refresh">
          <Icon icon="radix-icons:reload" class="h-6 w-6" />
        </Button>
      </div>
      <div v-if="data && status !== 'pending'">
        <StatisticsOne :data="data" />
      </div>
      <div
        v-else
        class="flex min-h-[40vh] flex-col items-center justify-center"
      >
        <Spinner />
      </div>
    </div>
  </div>
</template>
