<script setup lang="ts">
import { ref } from 'vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { formatDate } from '~/helpers/helpFunctions'

const currentDate = ref(new Date())

const props = defineProps({
  routeNum: {
    type: Number,
    required: true,
  },
  easyRouteCount: {
    type: Number,
    required: true,
  },
  normalRouteCount: {
    type: Number,
    required: true,
  },
  hardRouteCount: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="mb-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader>
        <CardTitle>Route Total</CardTitle>
        <CardDescription
          >Irreversible{{ formatDate(currentDate) }}</CardDescription
        >
      </CardHeader>
      <CardContent>{{ props.routeNum }} Routes</CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Easy Routes</CardTitle>
        <CardDescription>Irreversible</CardDescription>
      </CardHeader>
      <CardContent> {{ props.easyRouteCount }} Routes</CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Normal Routes</CardTitle>
        <CardDescription>Irreversible</CardDescription>
      </CardHeader>
      <CardContent> {{ props.normalRouteCount }} Routes</CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Hard Routes</CardTitle>
        <CardDescription>Irreversible</CardDescription>
      </CardHeader>
      <CardContent> {{ props.hardRouteCount }} Routes</CardContent>
    </Card>
  </div>
</template>
