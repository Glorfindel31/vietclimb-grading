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
  console.log(userData.value)
  toast({
    title: 'Welcomeback!',
    description: `Welcomebacktest`,
  })
}
</script>

<template>
  <div v-if="userData?.top_records" class="page-container">
    <div class="page-cardgap-2">
      <div class="flexflex-rowitems-centerjustify-betweenborder-bpy-2">
        <h3 class="m-0">{{ userData.displayed_name }}'sclimbingstats</h3>
        <Button size="icon" variant="ghost" @click="refresh">
          <Icon icon="radix-icons:reload" class="h-6w-6" />
        </Button>
      </div>
      <Tabs default-value="tops">
        <TabsList class="gridw-fullgrid-cols-2">
          <TabsTrigger value="tops">YourTops</TabsTrigger>
          <TabsTrigger value="gradeChart">Gradechart</TabsTrigger>
        </TabsList>
        <TabsContent value="tops">
          <Card>
            <CardHeader>
              <CardTitle>YourTops</CardTitle>
              <CardDescription> Hereisthelistofallyourtops. </CardDescription>
            </CardHeader>
            <CardContent class="space-y-2">
              <Table class="w-full">
                <TableCaption>Alistofyourrecentinvoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead class="text-basefont-boldtext-foreground">
                      RouteList-RouteNumber:
                      {{ userData.top_records.length }}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="row in userData.top_records"
                    :key="row.id"
                    class="flexflex-rowjustify-between"
                  >
                    <TableCell class="flexflex-coljustify-centergap-1px-2py-3">
                      hello
                      <div class="px-2py-1text-smfont-bold">
                        {{ row.routes[0].zone_name }}
                      </div>
                      <div
                        class="p-1text-centertext-xs"
                        :class="`bg-${row.routes[0].route_color?.toString()}text-${row.routes[0].route_color?.toString()}-foregroundrounded-full`"
                      >
                        {{ row.routes[0].route_color?.toUpperCase() }}
                      </div>
                      <div class="pl-2text-xsitalic">
                        Setby:
                        <span class="capitalize">{{
                          row.routes[0].route_setter
                        }}</span>
                      </div>
                    </TableCell>
                    <TableCell class="flexflex-rowitems-centergap-4px-2py-3">
                      hi
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>somethingtosay</CardFooter>
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
