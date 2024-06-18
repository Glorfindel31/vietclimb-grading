<script setup lang="ts">
import type {
  UserListRecordsRoutes,
  TopRecordsRoutes,
} from '~/types/dashboard.type'

const props = defineProps<{
  data: UserListRecordsRoutes[]
}>()

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

const hideData = (input: string | null) => {
  if (!input) return '****'
  return input.toString().replace(/./g, '*')
}
</script>

<template>
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
      <TableRow v-for="user in props.data" :key="user.id">
        <TableCell v-if="user.show_name === true">
          {{ user.displayed_name }}
        </TableCell>
        <TableCell v-else>{{ hideData(user.displayed_name) }}</TableCell>

        <TableCell v-if="user.show_tops === true">
          {{ user.top_records.length }}
        </TableCell>
        <TableCell v-else>
          {{ hideData(user.top_records.length.toString()) }}
        </TableCell>

        <TableCell>{{ higherGrade(user.top_records) }}</TableCell>
        <TableCell>{{ topToPoints(user.top_records) }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
