<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type {
  UserListRecordsRoutes,
  TopRecordsRoutes,
} from '~/types/dashboard.type'

import type { Database } from '~/types/supabase.type'

type UserTablesType = ReturnType<typeof getUsersTablesStats>
type TopsTableChartType = ReturnType<typeof getRoutesStats>

interface GroupedRoutes {
  [key: string]: {
    record: TopRecordsRoutes['routes']
    count: number
  }
}

const supabase = useSupabaseClient<Database>()
const session = useSupabaseSession()

const getUsersTablesStats = (users: UserListRecordsRoutes[]) => {
  if (!users) return
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

const getRoutesStats = (top_record: TopRecordsRoutes[]) => {
  if (!top_record) return
  const grades: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  }

  const groupedRoutes = top_record.reduce<GroupedRoutes>(
    (acc, route: TopRecordsRoutes) => {
      const key: string = route.URID_linked
      if (!acc[key]) {
        acc[key] = { record: route.routes, count: 0 }
      }
      acc[key].count++
      return acc
    },
    {},
  )
  const topFive = Object.values(groupedRoutes)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  top_record.forEach(route => {
    route.routes?.route_grade ? (grades[route.routes.route_grade] += 1) : 0
  })

  const gradeMutation = Object.entries(grades).map(([gradeKey, gradeValue]) => {
    return {
      name: parseInt(gradeKey),
      value: gradeValue,
    }
  })

  return { grades: gradeMutation, topFive: topFive }
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
        users: getUsersTablesStats(users) as UserTablesType,
        tops: getRoutesStats(tops) as TopsTableChartType,
      }
    },
  },
)
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
      <div v-if="data && status !== 'pending'">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Tops</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Height</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="(user, index) in data.users" :key="index">
              <TableCell> {{ user?.displayed_name }} </TableCell>
              <TableCell>{{ user?.tops }} </TableCell>
              <TableCell>{{ user?.points }} </TableCell>
              <TableCell>{{ user?.height }} </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div v-if="data?.tops?.grades">
          <BarChart
            :data="data?.tops?.grades"
            :categories="['value']"
            :rounded-corners="5"
            :show-legend="false"
            :show-grid-line="false"
            index="value"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Top 5 of the most repeated routes</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="(record, index) in data.tops?.topFive"
              :key="index"
            >
              <TableCell>
                <div class="flex flex-col">
                  <span>{{ record.record.zone_name }}</span>
                  <span>{{ record.record.route_color }}</span>
                  <span>{{ record.record.route_setter }}</span>
                </div>
              </TableCell>
              <TableCell>
                <div class="flex flex-col">
                  <span>grade: {{ record.record.route_grade }}</span>
                  <span>date: {{ record.record.route_date }}</span>
                </div>
              </TableCell>
              <TableCell>
                {{ record.count }}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div
        v-else
        class="flex min-h-[40vh] flex-col items-center justify-center"
      >
        <Spinner />
      </div>
    </div>
  </div>
</template>
