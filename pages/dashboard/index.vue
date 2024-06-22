<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { Database } from '~/types/supabase.type'
import type {
  UserListRecordsRoutes,
  TopRecordsRoutes,
} from '~/types/dashboard.type'

import {
  getUsersTablesStats,
  getRoutesStats,
  type UserTablesType,
  type TopsTableChartType,
} from './dataMutationDashboard'

const supabase = useSupabaseClient<Database>()
const session = useSupabaseSession()

const { data, refresh, status } = await useAsyncData(
  'data',
  async () => {
    try {
      const { data: userStatsReq, error: ErrorUserStatsReq } = await supabase
        .from('users')
        .select('*,top_records (*,routes(*))')

      if (ErrorUserStatsReq) {
        throw ErrorUserStatsReq.message
      }

      const { data: topStatsReq, error: ErrorTopStatsReq } = await supabase
        .from('top_records')
        .select('*,routes(*)')

      if (ErrorTopStatsReq) {
        throw ErrorTopStatsReq.message
      }

      return {
        users: userStatsReq as UserListRecordsRoutes[],
        tops: topStatsReq as TopRecordsRoutes[],
      }
    } catch (error) {
      console.error(error)
      return { users: [], tops: [] }
    }
  },
  {
    transform: ({
      users,
      tops,
    }: {
      users: UserListRecordsRoutes[]
      tops: TopRecordsRoutes[]
    }) => {
      return {
        users: getUsersTablesStats(users) as UserTablesType[],
        tops: getRoutesStats(tops) as TopsTableChartType,
      }
    },
  },
)
</script>

<template>
  <div class="page-container">
    <div class="page-card gap-4 py-8">
      <div class="flex flex-row justify-between p-2">
        <h1>Dashboard</h1>
        <div class="flex flex-row gap-2">
          <Button v-if="session?.user" size="icon" variant="ghost" as-child>
            <NuxtLink to="/user">
              <Icon icon="radix-icons:person" class="h-6 w-6" />
            </NuxtLink>
          </Button>
          <Button size="icon" variant="ghost" @click="refresh">
            <Icon icon="radix-icons:reload" class="h-6 w-6" />
          </Button>
        </div>
      </div>
      <div class="page-card gap-4">
        <DashboardUsersRanking v-if="data" :data="data" :status="status" />
        <DashboardUsersRankingBySize
          v-if="data"
          :data="data"
          :status="status"
        />
        <DashboardChartMostRepeatedLevel
          v-if="data"
          :data="data"
          :status="status"
        />
        <DashboardTopFiveRoutes v-if="data" :data="data" :status="status" />
      </div>
    </div>
  </div>
</template>
