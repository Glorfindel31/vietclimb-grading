<script setup lang="ts">
import { formatDateString } from '~/helpers/helpFunctions'
import type { AllData } from '~/pages/dashboard/dataMutationDashboard'

const props = defineProps({
  data: {
    type: Object as () => AllData,
    default: () => ({}),
  },
  status: {
    type: String,
    default: () => '',
  },
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Routes Top 5</CardTitle>
      <CardDescription>Here are the 5 most repeated routes</CardDescription>
    </CardHeader>
    <CardContent v-if="props.data?.tops?.topFive && props.status !== 'pending'">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Infos</TableCell>
            <TableCell>Grade / date</TableCell>
            <TableCell class="text-right">Nbr of Rep</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="(record, index) in props.data.tops?.topFive"
            :key="index"
          >
            <TableCell>
              <div class="flex flex-col gap-1">
                <span>{{ record.record.zone_name }}</span>
                <span
                  class="w-fit px-2 py-1 text-center text-xs uppercase"
                  :class="`bg-${record?.record?.route_color?.toString()} text-${record?.record?.route_color?.toString()}-foreground rounded-full`"
                >
                  {{ record.record.route_color }}
                </span>
                <span class="text-xs capitalize italic">
                  Set by: {{ record.record.route_setter }}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div class="flex flex-col gap-1">
                <span>grade: {{ record.record.route_grade }}</span>
                <span
                  >Date:
                  {{
                    record?.record?.route_date
                      ? formatDateString(record?.record?.route_date)
                      : 'no date'
                  }}</span
                >
              </div>
            </TableCell>
            <TableCell class="text-right">
              {{ record.count }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
    <CardContent v-else class="flex items-center justify-center">
      <Spinner />
    </CardContent>
  </Card>
</template>
