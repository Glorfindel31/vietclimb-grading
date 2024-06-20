<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type {
  UserListRecordsRoutes,
  TopRecordsRoutes,
} from '~/types/dashboard.type'

import type { Database } from '~/types/supabase.type'

type UserTablesType = ReturnType<typeof getUsersTablesStats>

const supabase = useSupabaseClient<Database>()
const session = useSupabaseSession()

const topStats = ref<TopRecordsRoutes[]>([])
const usersTablesStats = ref<UserTablesType>()

const getUsersTablesStats = (users: UserListRecordsRoutes[]) => {
  const getPoints = (top_records: TopRecordsRoutes[]) => {
    const pointsPerRoute = top_records.reduce(
      (acc, record: TopRecordsRoutes) => {
        acc += record.routes?.route_grade || 0
        return acc
      },
      0,
    )

    return pointsPerRoute
  }

  const usersTablesStats = users.map(user => {
    if (!user) return

    const points = getPoints(user.top_records)

    return {
      displayed_name:
        user.displayed_name !== null && user.displayed_name.length > 10
          ? user?.displayed_name?.slice(0, 10) + '...'
          : user.displayed_name,
      tops: user.top_records.length,
      points: points,
      height: user.height ? user.height : 'N/A',
    }
  })
  return usersTablesStats
}

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
        users: getUsersTablesStats(users),
        tops: tops,
      }
    },
  },
)

watchEffect(() => {
  if (data?.value) {
    topStats.value = data.value.tops
    usersTablesStats.value = data.value.users
  }
})
</script>

<template>
  <div class="page-container">
    <div class="page-card gap-4">
      <div class="flex flex-row justify-between">
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
      <div v-if="data && status !== 'pending'"></div>
      <div
        v-else
        class="flex min-h-[40vh] flex-col items-center justify-center"
      >
        <Spinner />
      </div>
    </div>
  </div>
</template>
