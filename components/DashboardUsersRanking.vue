<script setup lang="ts">
import { columns } from '~/components/dashboardRankingTable/columns'
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
      <CardTitle> Ranking </CardTitle>
      <CardDescription>Check out your rank</CardDescription>
    </CardHeader>
    <CardContent v-if="props.data.users && props.status !== 'pending'">
      <DashboardRankingTableDataTable
        :columns="columns"
        :data="props.data.users"
      />
    </CardContent>
    <CardContent v-else class="flex items-center justify-center">
      <Spinner />
    </CardContent>
  </Card>
</template>
