<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { UserWithTopRecordsAndRoutes } from '@/types/userTable.type'
import { useToast } from '@/components/ui/toast/use-toast'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const userData = ref<UserWithTopRecordsAndRoutes | null>(null)

const { toast } = useToast()

definePageMeta({
  middleware: ['auth'],
  //ormiddleware:'auth'
})

const formatDate = (isoDateString: Date) => {
  const date = new Date(isoDateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed
  const year = date.getFullYear().toString().substr(-2) // Get the last two digits of the year
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}/${month}/${year} - ${hours}:${minutes}`
}

const { data, refresh } = await useAsyncData('userData', async () => {
  if (!user.value) return
  const { data, error } = await supabase
    .from('users')
    .select('*,top_records(*,routes(*))')
    .eq('UID', user.value.id)
  if (error) {
    console.error(error)
    return
  }
  return data[0]
})

if (data.value) {
  userData.value = data.value
  toast({
    title: 'Welcome back!',
    description: `yo have some data!`,
  })
}
</script>

<template>
  <div v-if="userData?.top_records" class="page-container">
    <div class="page-card gap-2">
      <div class="flex flex-row items-center justify-between border-b py-2">
        <h3 class="m-0">{{ userData.displayed_name }}'s climbing stats</h3>
        <Button size="icon" variant="ghost" @click="refresh">
          <Icon icon="radix-icons:reload" class="h-6w-6" />
        </Button>
      </div>
      <Tabs default-value="tops">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="tops">Your Tops</TabsTrigger>
          <TabsTrigger value="gradeChart">Grade chart</TabsTrigger>
        </TabsList>
        <TabsContent value="tops">
          <Card>
            <CardHeader>
              <CardTitle>YourTops</CardTitle>
              <CardDescription>
                Here is the list of all your tops.
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">
              <Table class="w-full">
                <TableCaption hidden
                  >Here is the list of all your tops.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead class="text-base font-bold text-foreground">
                      Route List - Route Number:
                      {{ userData.top_records.length }}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="row in userData.top_records"
                    :key="row.id"
                    class="flex flex-row justify-between"
                  >
                    <TableCell
                      class="flex flex-col justify-center gap-1 px-2 py-3"
                    >
                      <div class="px-2 py-1 text-sm font-bold">
                        {{ row.routes.zone_name }}
                      </div>
                      <div
                        class="w-fit px-3 py-2 text-center text-xs"
                        :class="`bg-${row.routes.route_color?.toString()} text-${row.routes.route_color?.toString()}-foreground rounded-full`"
                      >
                        {{ row.routes.route_color?.toUpperCase() }}
                      </div>
                      <div class="pl-2 text-xs italic">
                        Set by:
                        <span class="capitalize">
                          {{ row.routes.route_setter }}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      class="flex flex-col items-end gap-1 px-2 py-3 text-right text-xs"
                    >
                      <span>Setter's Grades: {{ row.routes.route_grade }}</span>
                      <span>Your Grades: {{ row.user_grade }}</span>
                      <span class="flex flex-row items-center gap-1">
                        Your Rating:<StarsRating :rating="row.user_rate" />
                      </span>
                      <span>
                        {{ formatDate(row.created_at) }}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="gradeChart">
          <Card>
            <CardHeader>
              <CardTitle>Gradechart</CardTitle>
              <CardDescription>hmmm</CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">hmmm</CardContent>
            <CardFooter>hmmm</CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
  <div v-else>Oupss</div>
</template>
