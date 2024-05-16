<script setup
        lang="ts">
          import type { DataStructure } from '@/components/tableGrad/columns'
          import {
            transformData,
            easyRouteCounter,
            normalRouteCounter
          } from '~/lib/definition'

          import type { RouteCount } from '~/lib/definition'

          import RouteCountCards from '@/components/RouteCountCards.vue'
          import RouteList from '@/components/RouteList.vue'
          import Chart from '@/components/Chart.vue'
          import ChartRouteSetter from '@/components/ChartRouteSetter.vue'

          const { data } = await useFetch<DataStructure>('https://rest-google-sheet.vercel.app/api/v1/googlesheet')

          const routeNumber = ref<RouteCount[] | null>(null)
          const easyRouteCount = ref<number | 0>(0)
          const normalRouteCount = ref<number | 0>(0)
          const hardRouteCount = ref<number | 0>(0)

          if (data.value) {
            routeNumber.value = transformData(data.value.transformedValues)
            easyRouteCount.value = easyRouteCounter(routeNumber.value)
            normalRouteCount.value = normalRouteCounter(routeNumber.value)
            hardRouteCount.value = data.value.routeNum - easyRouteCount.value - normalRouteCount.value
          }

</script>

<template>
  <div class="m-2 md:m-10 h-full">
    <div v-if="data" class="flex flex-col-reverse md:flex-col gap-4 justify-center items-center">
      <RouteCountCards :route-num="data.routeNum" :easy-route-count="easyRouteCount"
        :normal-route-count="normalRouteCount" :hard-route-count="hardRouteCount" />
      <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 w-full">
        <Chart :incoming-data="data.transformedValues" class="flex flex-col justify-center items-center w-full" />
        <ChartRouteSetter :incoming-data="data.transformedValues"
          class="flex flex-col justify-center items-center w-full" />
      </div>
      <div class="flex flex-col justify-center min-w-full">
        <RouteList :data="data" />
      </div>
    </div>
    <div v-else>
      Loading...
    </div>
  </div>
</template>

<style scoped></style>
