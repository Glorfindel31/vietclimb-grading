<script setup
		lang="ts">
			import type { DataStructure, RouteCount } from "~/types/dataTable.type";
			import {
				transformData,
				easyRouteCounter,
				normalRouteCounter,
			} from "~/helpers/helpFunctions";


			import RouteCountCards from "@/components/RouteCountCards.vue";
			import RouteList from "@/components/RouteList.vue";
			import Chart from "@/components/Chart.vue";
			import ChartRouteSetter from "@/components/ChartRouteSetter.vue";

			const filterData = (data: DataStructure): DataStructure => {
				const filteredValues = data.transformedValues.filter(
					(route) => route.grade && route.color,
				);
				return {
					...data,
					routeNum: filteredValues.length,
					transformedValues: filteredValues,
				};
			};

			const { data: incomingData } =
				await useFetch<DataStructure>("/api/googlesheet");
			let filteredData: DataStructure | null = null;
			if (incomingData.value) {
				filteredData = filterData(incomingData.value);
			}

			const data = ref<DataStructure | null>(filteredData);
			const routeNumber = ref<RouteCount[] | null>(null);
			const easyRouteCount = ref<number | 0>(0);
			const normalRouteCount = ref<number | 0>(0);
			const hardRouteCount = ref<number | 0>(0);

			if (data.value) {
				routeNumber.value = transformData(data.value.transformedValues);
				easyRouteCount.value = easyRouteCounter(routeNumber.value);
				normalRouteCount.value = normalRouteCounter(routeNumber.value);
				hardRouteCount.value =
					data.value.routeNum - easyRouteCount.value - normalRouteCount.value;
			}
</script>

<template>
	<div class="m-2 h-full md:m-10">
		<div v-if="data" class="flex flex-col-reverse items-center justify-center gap-4 md:flex-col">
			<RouteCountCards :route-num="data.routeNum" :easy-route-count="easyRouteCount"
				:normal-route-count="normalRouteCount" :hard-route-count="hardRouteCount" />
			<div class="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
				<Chart :incoming-data="data.transformedValues"
					class="flex w-full flex-col items-center justify-center" />
				<ChartRouteSetter :incoming-data="data.transformedValues"
					class="flex w-full flex-col items-center justify-center" />
			</div>
			<div class="flex min-w-full flex-col justify-center">
				<RouteList :data="data" />
			</div>
		</div>
		<div v-else>Loading...</div>
	</div>
</template>

<style scoped></style>
