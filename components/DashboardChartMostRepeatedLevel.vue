<script setup lang="ts">
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
      <CardTitle>Level Repetition</CardTitle>
      <CardDescription>Irreversible</CardDescription>
    </CardHeader>
    <CardContent v-if="props.data?.tops?.grades && props.status !== 'pending'">
      <div v-if="props.data?.tops?.grades">
        <BarChart
          :data="props.data?.tops?.grades"
          :categories="['value']"
          :rounded-corners="5"
          :show-legend="false"
          :show-grid-line="false"
          index="name"
        />
      </div>
    </CardContent>
    <CardContent v-else class="flex items-center justify-center">
      <Spinner />
    </CardContent>
    <CardFooter>
      <blockquote>
        Here you can see for each bar, the number of tops per level.
      </blockquote>
    </CardFooter>
  </Card>
</template>
