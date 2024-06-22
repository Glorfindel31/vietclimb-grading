import type {
  UserListRecordsRoutes,
  TopRecordsRoutes,
} from '~/types/dashboard.type'

export type UserTablesType = ReturnType<typeof getUsersTablesStats>
export type TopsTableChartType = ReturnType<typeof getRoutesStats>

export type AllData = {
  users: UserTablesType[]
  tops: TopsTableChartType
}

export interface GroupedRoutes {
  [key: string]: {
    record: TopRecordsRoutes['routes']
    count: number
  }
}

export const getUsersTablesStats = (users: UserListRecordsRoutes[]) => {
  if (!users) return

  const getPoints = (top_records: TopRecordsRoutes[]) => {
    if (!top_records) return
    return top_records.reduce((acc, record: TopRecordsRoutes) => {
      acc += record.routes?.route_grade || 0
      return acc
    }, 0)
  }

  return users.map(user => {
    if (!users) return
    return {
      displayed_name:
        user.displayed_name !== null && user.displayed_name.length > 10
          ? user?.displayed_name?.slice(0, 15) + '...'
          : user.displayed_name,
      tops: user.top_records.length,
      points: getPoints(user.top_records),
      height: user.height ? user.height : 'N/A',
    }
  })
}

export const getRoutesStats = (top_record: TopRecordsRoutes[]) => {
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

  top_record.forEach(route => {
    route.routes?.route_grade ? (grades[route.routes.route_grade] += 1) : 0
  })

  return {
    grades: Object.entries(grades).map(([gradeKey, gradeValue]) => {
      return {
        name: parseInt(gradeKey),
        value: gradeValue,
      }
    }),
    topFive: Object.values(groupedRoutes)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5),
  }
}
