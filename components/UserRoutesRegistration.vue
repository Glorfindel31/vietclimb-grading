<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type {
  UserWithTopRecords,
  RouteTabsDataType,
} from '@/types/userTable.type'
import { stringCompressor } from '~/helpers/helpFunctions'

const props = defineProps<{
  routeTabs: RouteTabsDataType
  userData: UserWithTopRecords
  refresh: () => void
  handleRemoveRecord: (TUID: string) => Promise<void>
}>()

const computeMode = (numbers: Array<number>): number => {
  const counts: Record<string, number> = {}
  let maxCount = 0
  let mode: number | undefined

  numbers.forEach((num) => {
    counts[num] = (counts[num] || 0) + 1
  })

  maxCount = Math.max(...Object.values(counts))

  Object.keys(counts).forEach((key) => {
    if (counts[key] === maxCount) {
      mode = Number(key)
      return
    }
  })
  if (mode === undefined) {
    return 0
  }
  return mode
}
</script>

<template>
  <Tabs
    v-if="props.userData"
    default-value="Moon Korner"
    class="min-w-[300px] max-w-md"
  >
    <TabsList class="grid w-full grid-cols-9">
      <TabsTrigger
        v-for="(tab, index) in routeTabs"
        :key="index"
        :value="tab.zone"
      >
        {{ tab.tabName }}
      </TabsTrigger>
    </TabsList>
    <TabsContent
      v-for="(tab, index) in routeTabs"
      :key="index"
      :value="tab.zone"
    >
      <Card>
        <CardHeader>
          <CardTitle>{{ tab.zone }}</CardTitle>
          <CardDescription>
            {{ tab.cardDescription }}
          </CardDescription>
        </CardHeader>
        <Table class="w-full">
          <TableHeader>
            <TableRow>
              <TableHead
                class="text-base font-bold text-foreground"
              >
                Route List - Route Number:
                {{ tab.routes.length }}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="row in tab.routes"
              :key="row.URID"
              class="flex flex-row justify-between"
            >
              <TableCell
                class="flex flex-col justify-center gap-1 px-2 py-3"
              >
                <div
                  class="px-2 py-1 text-sm font-bold"
                >
                  {{ row.zone_name }}
                </div>
                <div
                  class="p-1 text-center text-xs"
                  :class="`bg-${row.route_color?.toString()} text-${row.route_color?.toString()}-foreground rounded-full`"
                >
                  {{
                    row.route_color?.toUpperCase()
                  }}
                </div>
                <div class="pl-2 text-xs italic">
                  Set by:
                  <span class="capitalize">{{
                    row.route_setter
                  }}</span>
                </div>
              </TableCell>
              <TableCell
                class="flex flex-row items-center gap-4 px-2 py-3"
              >
                <div
                  class="flex flex-col gap-1 text-xs"
                >
                  <div>Grade:</div>
                  <div>
                    Setter's -
                    {{ row.route_grade }}
                  </div>
                  <div :key="index">
                    Comunity's -
                    {{
                      row.top_records.length
                        > 0
                        ? computeMode(
                          row.top_records
                            .map(
                              (
                                route,
                              ) =>
                                route.user_grade,
                            )
                            .filter(
                              (
                                grade: number,
                              ): grade is number =>
                                grade
                                !== null,
                            ),
                        )
                        : "n/a"
                    }}
                  </div>
                  <div
                    class="flex flex-row items-center gap-1 italic"
                  >
                    Rate:
                    <StarsRating
                      :key="index"
                      :rating="
                        row.top_records
                          .length > 0
                          ? computeMode(
                            row.top_records
                              .map(
                                (
                                  route,
                                ) =>
                                  route.user_rate,
                              )
                              .filter(
                                (
                                  rate,
                                ): rate is number =>
                                  rate
                                  !== null,
                              ),
                          )
                          : 0
                      "
                    />
                  </div>
                </div>
                <Dialog
                  v-if="
                    userData.top_records.some(
                      (record) =>
                        record.URID_linked
                        === row.URID,
                    )
                  "
                  :key="row?.URID?.toString()"
                >
                  <DialogTrigger as-child>
                    <Button
                      variant="outline"
                      size="icon"
                      class="border-green-600 text-green-600 hover:bg-destructive"
                    >
                      <Icon
                        icon="radix-icons:cross-2"
                        class="h-5 w-5"
                      />
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    class="sm:max-w-[425px]"
                  >
                    <DialogHeader>
                      <DialogTitle>
                        Remove your top
                        Record?
                      </DialogTitle>
                      <DialogDescription>
                        Are you sure you
                        want to remove this
                        route from your
                        records?
                        <div
                          class="my-2 flex flex-col justify-center gap-1 rounded-lg border p-2"
                        >
                          <div
                            class="px-2 py-1 text-sm font-bold"
                          >
                            {{
                              row.zone_name
                            }}
                          </div>
                          <div
                            class="w-fit self-center px-2 py-1 text-center text-xs"
                            :class="`bg-${row.route_color?.toString()} text-${row.route_color?.toString()}-foreground rounded-full`"
                          >
                            {{
                              row.route_color?.toUpperCase()
                            }}
                          </div>
                          <div
                            class="pl-2 text-xs italic"
                          >
                            Set by:
                            <span
                              class="capitalize"
                            >{{
                              row.route_setter
                            }}</span>
                          </div>
                          <div>
                            Grade:
                          </div>
                          <div>
                            Setter's -
                            {{
                              row.route_grade
                            }}
                          </div>
                          <div
                            :key="
                              index
                            "
                          >
                            Comunity's
                            -
                            {{
                              row
                                .top_records
                                .length
                                > 0
                                ? computeMode(
                                  row.top_records
                                    .map(
                                      (
                                        route,
                                      ) =>
                                        route.user_grade,
                                    )
                                    .filter(
                                      (
                                        grade,
                                      ): grade is number =>
                                        grade
                                        !== null,
                                    ),
                                )
                                : "n/a"
                            }}
                          </div>
                          <div
                            class="flex flex-row items-center justify-center gap-1 text-xs italic"
                          >
                            Rate:
                            <StarsRating
                              :key="
                                index
                              "
                              :rating="
                                row
                                  .top_records
                                  .length
                                  > 0
                                  ? computeMode(
                                    row.top_records
                                      .map(
                                        (
                                          route,
                                        ) =>
                                          route.user_rate,
                                      )
                                      .filter(
                                        (
                                          rate,
                                        ): rate is number =>
                                          rate
                                          !== null,
                                      ),
                                  )
                                  : 0
                              "
                            />
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter
                      class="flex flex-col gap-2"
                    >
                      <DialogClose as-child>
                        <Button
                          type="button"
                          variant="destructive"
                          @click="
                            () =>
                              props.handleRemoveRecord(
                                stringCompressor(
                                  row.URID
                                    + userData.UID,
                                ),
                              )
                          "
                        >
                          Delete
                        </Button>
                      </DialogClose>
                      <DialogClose as-child>
                        <Button
                          type="button"
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Drawer v-else>
                  <DrawerTrigger as-child>
                    <Button
                      variant="outline"
                      size="icon"
                    >
                      <Icon
                        icon="radix-icons:plus"
                        class="h-5 w-5"
                      />
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader
                      class="flex flex-col justify-center"
                    >
                      <DrawerTitle
                        class="py-5 text-center text-2xl"
                      >
                        {{ row.zone_name }}
                      </DrawerTitle>
                      <DrawerDescription
                        class="text-center text-sm"
                        hidden
                      >
                        Fill the form to
                        submit your top
                      </DrawerDescription>
                      <div
                        class="flex flex-row gap-2 self-center rounded-lg p-4"
                      >
                        <div
                          class="w-fit self-center px-2 py-1 text-center text-xs font-bold"
                          :class="`bg-${row.route_color?.toString()} text-${row.route_color?.toString()}-foreground rounded-full`"
                        >
                          {{
                            row.route_color?.toUpperCase()
                          }}
                        </div>
                        <div
                          class="text-left"
                        >
                          <div>
                            Setter's
                            grade:
                            {{
                              row.route_grade
                            }}
                          </div>
                          <div
                            class="text-xs italic"
                          >
                            Set by:
                            <span
                              class="capitalize"
                            >
                              {{
                                row.route_setter
                              }}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div
                        class="flex flex-col justify-center rounded border p-4"
                      >
                        <FormTops
                          :route-data="
                            row
                          "
                          :user-data="
                            props.userData
                          "
                          :refresh="
                            props.refresh
                          "
                        />
                      </div>
                    </DrawerHeader>
                    <DrawerFooter>
                      <DrawerClose
                        as-child
                        class="self-center"
                      >
                        <Button
                          variant="outline"
                          size="icon"
                        >
                          <Icon
                            icon="radix-icons:cross-1"
                            class="h-6 w-6"
                          />
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </TabsContent>
  </Tabs>
</template>

<style lang="css" scoped></style>
