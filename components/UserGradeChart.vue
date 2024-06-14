<script setup lang="ts">
import type { UserWithTopRecordsAndRoutes } from '@/types/userTable.type'

const props = defineProps<{
  userData: UserWithTopRecordsAndRoutes
}>()
const toBarData = (data: UserWithTopRecordsAndRoutes) => {
  const grades = data.top_records.map(record => record.routes.route_grade)
  const gradeCount = grades.reduce(
    (acc, grade) => {
      acc[grade] = (acc[grade] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const barData = Object.entries(gradeCount).map(([grade, count]) => ({
    grade: parseInt(grade),
    count,
  }))
  return barData
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Grade chart</CardTitle>
      <CardDescription hidden>Grade chart</CardDescription>
    </CardHeader>
    <CardContent class="space-y-2">
      <BarChart
        :data="toBarData(props.userData)"
        :categories="['count']"
        :rounded-corners="5"
        :show-legend="false"
        index="grade"
      />
    </CardContent>
    <CardFooter>This is your personal grade Chart.</CardFooter>
  </Card>
</template>
