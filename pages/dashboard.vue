<script setup lang="ts">
// import { Icon } from '@iconify/vue'
import type {
  UserListRecordsRoutes,
  TopRecordsRoutes,
} from '~/types/dashboard.type'
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

const higherGrade = (records: TopRecordsRoutes[]) => {
  let highestGrade = 0
  records.forEach((record: TopRecordsRoutes) => {
    if (record.routes.route_grade && record.routes.route_grade > highestGrade) {
      highestGrade = record.routes.route_grade
    }
  })
  return highestGrade
}

const topToPoints = (records: TopRecordsRoutes[]) => {
  let points = 0
  records.forEach((record: TopRecordsRoutes) => {
    if (record.routes.route_grade) {
      points += record.routes.route_grade
    }
  })
  return points
}

watchEffect(() => {})
</script>

<template>
  <div class="page-container">
    <div class="page-card">
      <h1>Dashboard</h1>
      <div v-if="data">
        <Table>
          <TableCaption>Climbers Stats</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Top Amount</TableHead>
              <TableHead>Higher Grade</TableHead>
              <TableHead>Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="user in data" :key="user.id">
              <TableCell>{{ user.displayed_name }}</TableCell>
              <TableCell>{{ user.top_records.length }}</TableCell>
              <TableCell>{{ higherGrade(user.top_records) }}</TableCell>
              <TableCell>{{ topToPoints(user.top_records) }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
