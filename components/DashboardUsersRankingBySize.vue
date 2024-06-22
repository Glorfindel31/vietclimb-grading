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
  { value: 'N/A', label: 'N/A' },
  { value: '<130', label: '< 130' },
  { value: '131-140', label: '131/140' },
  { value: '141-150', label: '141/150' },
  { value: '151-160', label: '151/160' },
  { value: '161-170', label: '161/170' },
  { value: '171-180', label: '171/180' },
  { value: '181-190', label: '181/190' },
  { value: '191-200', label: '191/200' },
  { value: '201-210', label: '201/210' },
  { value: '>210', label: '> 220' },
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
  } else if (selectedSize === '<130') {
    return (data as UserTablesType[]).filter(
      user =>
        hasHeightProperty(user) &&
        Number(user.height) >= 0 &&
        Number(user.height) <= 130,
    )
  } else if (selectedSize === '>210') {
    return (data as UserTablesType[]).filter(
      user =>
        hasHeightProperty(user) &&
        Number(user.height) >= 210 &&
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
      <CardTitle> Ranking </CardTitle>
      <CardDescription>Check out your rank</CardDescription>
    </CardHeader>
    <CardContent>
      <Tabs default-value="N/A">
        <TabsList class="flex w-fit flex-row flex-wrap">
          <TabsTrigger
            v-for="category in sizeCategories"
            :key="category.value"
            :value="category.value"
            class="border-1 hover:border-1 border-secondary hover:border-primary"
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
