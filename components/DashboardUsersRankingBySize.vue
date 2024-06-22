<script setup lang="ts">
import { columns } from '~/components/dashboardRankingTable/columns'
import type {
  AllData,
  UserTablesType,
} from '~/pages/dashboard/dataMutationDashboard'

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

const sizeCategories = [
  { value: 'N/A', label: 'N / A' },
  { value: '<140', label: '< 140' },
  { value: '141-150', label: '141 to 150' },
  { value: '151-160', label: '151 to 160' },
  { value: '161-170', label: '161 to 170' },
  { value: '171-180', label: '171 to 180' },
  { value: '181-190', label: '181 to 190' },
  { value: '>190', label: '> 190' },
]

const filteredData = (
  data: UserTablesType[],
  selectedSize: string,
): UserTablesType[] => {
  if (!data || !selectedSize) return []

  const hasHeightProperty = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user: any,
  ): user is { height: string | number } => {
    return (
      (user !== undefined && typeof user.height === 'string') ||
      typeof user.height === 'number'
    )
  }

  if (selectedSize === 'N/A') {
    return (data as UserTablesType[]).filter(
      user => hasHeightProperty(user) && user.height === 'N/A',
    )
  } else if (selectedSize === '<140') {
    return (data as UserTablesType[]).filter(
      user =>
        hasHeightProperty(user) &&
        Number(user.height) >= 0 &&
        Number(user.height) <= 140,
    )
  } else if (selectedSize === '>190') {
    return (data as UserTablesType[]).filter(
      user =>
        hasHeightProperty(user) &&
        Number(user.height) >= 190 &&
        Number(user.height) <= 300,
    )
  } else {
    return (data as UserTablesType[]).filter(
      user =>
        hasHeightProperty(user) &&
        Number(user.height) >= parseInt(selectedSize.split('-')[0]) &&
        Number(user.height) <= parseInt(selectedSize.split('-')[1]),
    )
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Ranking by height</CardTitle>
      <CardDescription>
        Click on the tab from the height you would like to see
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Tabs default-value="N/A">
        <TabsList
          class="flex w-fit flex-row flex-wrap justify-between rounded-lg"
        >
          <TabsTrigger
            v-for="category in sizeCategories"
            :key="category.value"
            :value="category.value"
            class="w-auto p-2"
          >
            {{ category.label }}
          </TabsTrigger>
        </TabsList>
        <TabsContent
          v-for="category in sizeCategories"
          :key="category.value"
          :value="category.value"
        >
          <div v-if="filteredData.length > 0 && props.status !== 'pending'">
            <DashboardRankingTableDataTable
              :columns="columns"
              :data="filteredData(props.data.users, category.value)"
            />
          </div>
          <div v-else class="flex items-center justify-center">
            <Spinner />
          </div>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
</template>
