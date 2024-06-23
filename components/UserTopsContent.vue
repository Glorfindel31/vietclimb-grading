<script setup lang="ts">
import type { UserWithTopRecordsAndRoutes } from '@/types/userTable.type'

const props = defineProps<{
  userData: UserWithTopRecordsAndRoutes
}>()

const formatDate = (isoDateString: Date) => {
  const date = new Date(isoDateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const year = date.getFullYear().toString().substr(-2) // Get the last two digits of the year
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} - ${hours}:${minutes}`
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>YourTops</CardTitle>
      <CardDescription>Irreversible</CardDescription>
    </CardHeader>
    <CardContent class="space-y-2">
      <Table class="w-full">
        <TableCaption hidden>Here is the list of all your tops. </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead class="text-base font-bold text-foreground">
              Route List - Route Number:
              {{ props.userData.top_records.length }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="row in props.userData.top_records"
            :key="row.id"
            class="flex flex-row justify-between"
          >
            <TableCell
              class="flex flex-col items-start justify-center gap-1 px-2 py-3"
            >
              <div class="px-2 py-1 text-sm font-bold">
                {{ row.routes.zone_name }}
              </div>
              <div
                class="w-fit px-3 py-2 text-center text-xs"
                :class="`bg-${row.routes.route_color?.toString()} text-${row.routes.route_color?.toString()}-foreground rounded-full`"
              >
                {{ row.routes.route_color?.toUpperCase() }}
              </div>
              <div class="pl-2 text-xs italic">
                Set by:
                <span class="capitalize">
                  {{ row.routes.route_setter }}
                </span>
              </div>
            </TableCell>
            <TableCell
              class="flex flex-col items-end justify-center gap-1 px-2 py-3 text-right text-xs"
            >
              <span>Setter's Grades: {{ row.routes.route_grade }}</span>
              <span>Your Grades: {{ row.user_grade }}</span>
              <span class="flex flex-row items-center gap-1">
                Your Rating:<StarsRating :rating="row.user_rate" />
              </span>
              <span>
                {{ formatDate(row.created_at) }}
              </span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
