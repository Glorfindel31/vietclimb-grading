<script setup lang="ts">
import type { Database } from '~/types/supabase.type'
import type {
  dataMutationResultExtended,
  DataBaseExtended,
  DataBaseInsert,
  NewGoogleRows,
} from '~/types/adminTable.type'
import { formatDateString } from '~/helpers/helpFunctions'
import { Spinner } from '@/components/ui/spinner'
import { useToast } from '@/components/ui/toast/use-toast'

definePageMeta({
  middleware: ['auth-admin'],
  // or middleware: 'auth'
})

const { toast } = useToast()

const supabase = useSupabaseClient<Database>()

const {
  status,
  data: allData,
  refresh,
} = await useLazyAsyncData(
  'allData',
  async () => {
    const { data: supabaseData } = await supabase.from('routes').select('*')
    const response = await $fetch('/api/googlesheet')
    const typedResponse = response as unknown as dataMutationResultExtended
    const googleData = typedResponse.transformedValues
    return { googleData: googleData, supabaseData: supabaseData }
  },
  {
    transform: data => {
      return {
        googleData:
          data.googleData
            .map((route, index) => {
              return {
                id: index + 1,
                RID: route.id,
                URID: `URID_${index + 1}_${route.id}_${route.name.replace(/\s+/g, '')}_${route.color}_${route.setter.replace(/\s+/g, '')}_${route.date}`,
                zone_name: route.name,
                route_color: route.color !== '' ? route.color : null,
                route_grade: route.grade !== '' ? route.grade : null,
                route_setter: route.setter !== '' ? route.setter : null,
                route_date: route.date !== '' ? route.date : null,
                route_link: route.link !== '' ? route.link : null,
              }
            })
            .sort((a, b) => a.id - b.id) || [],
        supabaseData: data.supabaseData?.sort((a, b) => a.id - b.id) || [],
      }
    },
  },
)

const checkData = ref<DataBaseExtended[]>([])
const dataToUpdate = ref<DataBaseInsert[]>([])
const idArrays = ref<Array<number | string>>([])
const oldData = ref<Array<string>>([])

const modifiedGroup = ref<{
  supabase: DataBaseExtended[]
  google: NewGoogleRows[]
}>({ supabase: [], google: [] })

const isIdentical = (
  googleData: NewGoogleRows[],
  supabaseData: DataBaseExtended[],
) => {
  const supabaseDataURID: DataBaseExtended[] = supabaseData.map(
    (route, index) => {
      const identical = googleData[index].URID === route.URID ? true : false
      return {
        ...route,
        identical: identical,
      }
    },
  )
  return supabaseDataURID as DataBaseExtended[]
}

const dataChanges = () => {
  checkData.value = isIdentical(
    allData.value?.googleData || ([] as NewGoogleRows[]),
    allData.value?.supabaseData || ([] as DataBaseExtended[]),
  )

  idArrays.value = checkData.value
    .filter(route => route.identical === false)
    .map(route => [route.id])
    .flat()

  oldData.value =
    allData.value?.supabaseData
      .filter(route => idArrays.value.includes(route.id))
      .map(route => route.URID) || []

  dataToUpdate.value = (
    allData.value?.googleData.filter(route =>
      idArrays.value.includes(route.id),
    ) || []
  ).map(route => ({
    id: Number(route.id),
    RID: Number(route.RID),
    route_color: route.route_color,
    route_date: route.route_date,
    route_grade:
      Number(route.route_grade) === 0 ? null : Number(route.route_grade),
    route_link: route.route_link,
    route_setter: route.route_setter,
    URID: route.URID,
    zone_name: route.zone_name,
  }))

  modifiedGroup.value = {
    google: allData.value?.googleData as NewGoogleRows[],
    supabase: checkData.value as DataBaseExtended[],
  }
}

watchEffect(() => {
  if (allData.value) {
    dataChanges()
  }
})

const updateHandler = async (e: Event) => {
  e.preventDefault()
  const array = await JSON.parse(JSON.stringify(dataToUpdate.value))
  const oldDataArray = await JSON.parse(JSON.stringify(oldData.value))

  if (array.length === 0) {
    toast({
      title: 'No data to update',
      description: `😒`,
      variant: 'destructive',
    })
    return
  }
  try {
    const { data: dataRemoved, error: errorRemoved } = await supabase
      .from('top_records')
      .delete()
      .in('URID_linked', oldDataArray)
      .select()
    if (errorRemoved) {
      throw new Error('Failed to delete records')
    } else {
      toast({
        title: 'Records deleted',
        description: `Records have been deleted successfully ${dataRemoved}`,
        variant: 'destructive',
      })
    }
    const { data, error } = await supabase.from('routes').upsert(array).select()
    if (data) {
      toast({
        title: 'Data updated',
        description: 'Data has been updated successfully',
      })
    } else if (error) {
      console.error('Error updating data 01', error)
      console.warn(array)
      toast({
        title: 'Error updating data',
        description: `error updating data${error}`,
        variant: 'destructive',
      })
    }
  } catch (error) {
    console.error('Error updating data 02', error)
  } finally {
    refresh()
  }
}

const refreshHandler = (e: Event) => {
  e.preventDefault()
  refresh()
  toast({
    title: 'Fresh start',
    description: 'Fetching your precious data',
  })
}
</script>

<template>
  <div class="page-container">
    <div class="page-card rounded-lg border bg-background">
      <div class="h-full">
        <h2>Admin</h2>
        <div class="flex flex-row justify-between py-4 align-middle">
          <p class="italic">Welcome into the database synchronization tool.</p>
          <div class="flex gap-2">
            <Button size="sm" variant="outline" @click="refreshHandler">
              Refresh
            </Button>
            <Button size="sm" variant="outline" @click="updateHandler">
              Update
            </Button>
          </div>
        </div>
      </div>
      <div
        v-if="status === 'pending'"
        class="flex min-h-[60vh] flex-col items-center justify-center"
      >
        <Spinner />
      </div>
      <div v-else-if="modifiedGroup" class="flex flex-col gap-2 sm:flex-row">
        <Table
          v-for="(dataList, index) in modifiedGroup"
          :key="index"
          class="rounded border p-1 text-center text-xs"
        >
          <TableCaption>
            Raw
            <span class="capitalize">{{ index }}</span> Sheet Data
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead
                class="w-full text-center text-base font-bold"
                colspan="7"
              >
                <span class="capitalize">{{ index }}</span>
                Sheet Data
              </TableHead>
            </TableRow>
            <TableRow class="text-base">
              <TableHead class="min-w-20 px-2 py-4 text-left">
                <div class="flex flex-col">
                  <p class="font-bold">ID</p>
                  <p class="font-bold">RID</p>
                </div>
              </TableHead>
              <TableHead class="px-2 py-4 text-center">
                <div class="flex flex-col">
                  <p class="font-bold">Zone Name</p>
                  <p class="font-bold">Color</p>
                  <p class="font-bold">Setter</p>
                </div>
              </TableHead>
              <TableHead class="px-2 py-4 text-right">
                <div class="flex flex-col">
                  <p class="font-bold">Route Grade</p>
                  <p class="font-bold">URID</p>
                  <p class="font-bold">Date</p>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="route in dataList"
              :key="route.id"
              :class="
                index === 'supabase' && 'identical' in route && !route.identical
                  ? 'bg-destructive'
                  : ''
              "
            >
              <TableCell class="min-w-20 px-2 py-4 text-sm">
                <div class="flex flex-col text-left">
                  <p>ID-{{ route.id }}</p>
                  <p>RID-{{ route.RID }}</p>
                </div>
              </TableCell>
              <TableCell class="w-full px-2 py-4 text-center text-sm">
                <div class="flex flex-col items-center gap-1">
                  <p>{{ route.zone_name }}</p>
                  <p
                    class="w-fit rounded-full px-4 py-0.5 uppercase"
                    :class="
                      route.route_color
                        ? `bg-${route.route_color?.toString()} text-${route.route_color?.toString()}-foreground`
                        : 'bg-foreground text-background'
                    "
                  >
                    {{ route.route_color ? route.route_color : 'COLOR' }}
                  </p>
                  <p class="capitalize">
                    {{ route.route_setter ? route.route_setter : 'Setter' }}
                  </p>
                </div>
              </TableCell>
              <TableCell class="w-fit px-2 py-4 text-right">
                <div class="flex flex-col justify-end gap-1">
                  <p class="text-sm">
                    Grade:
                    {{ route.route_grade ? route.route_grade : 'no grade' }}
                  </p>
                  <p class="text-[0.7rem]">
                    {{ route.URID?.slice(0, -13) }}
                  </p>
                  <p>
                    {{
                      route.route_date
                        ? formatDateString(route.route_date)
                        : 'no date'
                    }}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
