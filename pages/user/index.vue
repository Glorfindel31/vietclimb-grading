<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { UserTableStructure } from './UserTableStructure'
import type { Database } from '~/types/supabase.type'
import type {
  RouteTabsDataType,
  RouteWithTopRecords,
  UserWithTopRecords,
} from '@/types/userTable.type'
import { useToast } from '@/components/ui/toast/use-toast'

definePageMeta({
  middleware: ['auth'],
  // or middleware: 'auth'
})

const supabase = useSupabaseClient<Database>()
const session = useSupabaseSession()

const userData = ref<UserWithTopRecords | null>(null)
const routeList = ref<RouteWithTopRecords[]>([])
const routeTabs = ref<RouteTabsDataType>(UserTableStructure)

const { toast } = useToast()

const { data, refresh } = await useAsyncData('userData', async () => {
  if (!session.value) return
  const { data: userData, error: errorUser } = await supabase
    .from('users')
    .select('*,top_records (*)')
    .eq('UID', session.value.user.id)
  if (errorUser) {
    console.error(errorUser)
    return
  }
  const { data: routeList, error: errorRoutes } = await supabase
    .from('routes')
    .select('*,top_records (*)')
  if (errorRoutes) {
    console.error(errorRoutes)
    return
  }
  return { userData: userData[0], routeList: routeList }
})

watchEffect(() => {
  if (data.value && data.value.routeList) {
    userData.value = data.value.userData

    const newRouteList = data.value.routeList
      .filter(route => route.route_grade !== null)
      .sort((a, b) => a.id - b.id)

    const hasChanged =
      routeList.value.length !== newRouteList.length ||
      !routeList.value.every(
        (route, index) => route.id === newRouteList[index].id,
      ) ||
      !routeList.value.every(
        (route, index) =>
          route.top_records.length !== newRouteList[index].top_records.length,
      )

    if (hasChanged) {
      routeList.value = newRouteList
      routeTabs.value.forEach(tab => tab.routes.splice(0, tab.routes.length))

      routeTabs.value.forEach(tab => {
        const matchingRoutes = newRouteList.filter(
          route => route.zone_name === tab.zone,
        )
        tab.routes.push(...matchingRoutes)
      })
    }
  }
})

const handleRemoveRecord = async (TUID: string) => {
  const { error } = await supabase.from('top_records').delete().eq('TUID', TUID)
  if (error) {
    console.error(error)
    toast({
      title: 'Ascent not removed',
      description: `There was an error: ${error.message}`,
      variant: 'destructive',
    })
    return
  } else {
    refresh()
    toast({
      title: 'Ascent removed',
      description: `You have removed an ascent!`,
      variant: 'destructive',
    })
  }
}
</script>

<template>
  <div v-if="userData" class="page-container">
    <div class="page-card">
      <PageTopWrap>
        <PageTopTitle
          subtitle="Log your accents, rate the routes and give a rate to the route you
              climbed."
        >
          Welcome back
          <span class="capitalize italic text-primary">
            {{ userData?.displayed_name ?? '' }}
          </span>
        </PageTopTitle>
        <PageTopBtnWraps>
          <Button size="icon" variant="ghost" as-child>
            <NuxtLink to="/user/statistics">
              <Icon icon="radix-icons:bar-chart" class="h-6 w-6" />
            </NuxtLink>
          </Button>
          <Button size="icon" variant="ghost" as-child>
            <NuxtLink to="/user/settings">
              <Icon icon="radix-icons:gear" class="h-6 w-6" />
            </NuxtLink>
          </Button>
        </PageTopBtnWraps>
      </PageTopWrap>
      <UserRoutesRegistration
        :route-tabs="routeTabs"
        :user-data="userData"
        :refresh="refresh"
        :handle-remove-record="handleRemoveRecord"
      />
    </div>
  </div>
  <div v-else>
    <div class="page-container">
      <div class="page-card items-center justify-center rounded-lg border">
        <h1>Something went wrong... 😵‍💫</h1>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
