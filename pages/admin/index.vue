<script setup lang="ts">
import TableHead from "~/components/ui/table/TableHead.vue";
import type { Database } from "~/database.types";
import { formatDateString } from "~/lib/definition";

// db connection
const supabase = useSupabaseClient<Database>();
const googleData = await useFetch("/api/googlesheet");
const supabaseData = await supabase.from("routes").select("*");
</script>

<template>
  <div class="min-h-[80vh] w-full px-2 py-4">
    <div
      class="flex flex-col gap-8 rounded-lg border bg-background p-2 shadow-md"
    >
      <div>
        <h2>Admin</h2>
        <p class="italic">Welcome into the database synchronisation tool.</p>
      </div>
      <div class="flex flex-row gap-2">
        <!-- <Table class="rounded border p-1 text-center text-xs">
          <TableCaption>Raw Google Sheet Data</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead
                class="w-full text-center text-sm font-bold"
                colspan="7"
              >
                Google Sheet Data
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead class="w-[50px] text-center">RID</TableHead>
              <TableHead class="text-center">Zone Name</TableHead>
              <TableHead class="text-center">Route Color</TableHead>
              <TableHead class="w-[50px] text-center"> Route Grade </TableHead>
              <TableHead class="text-center">Route Setter</TableHead>
              <TableHead class="text-center">Route Date</TableHead>
              <TableHead class="text-center">Route link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="route in googleData.data.transformedValues"
              :key="route.id"
            >
              <TableCell>{{ route.id }}</TableCell>
              <TableCell class="text-nowrap">{{ route.name }}</TableCell>
              <TableCell class="text-nowrap">{{ route.color }}</TableCell>
              <TableCell class="text-nowrap">{{ route.grade }}</TableCell>
              <TableCell class="text-nowrap">{{ route.setter }}</TableCell>
              <TableCell>{{
                route.date ? formatDateString(route.date) : "no date"
              }}</TableCell>
              <TableCell>{{ route.link ? "link" : "nolink" }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Table class="rounded border p-1 text-center text-xs">
          <TableCaption>Raw Supabase Sheet Data</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead
                class="w-full text-center text-sm font-bold"
                colspan="7"
              >
                Supabase Data
              </TableHead>
            </TableRow>
            <TableRow>
              <TableHead class="w-[50px] text-center">RID</TableHead>
              <TableHead class="text-center">Zone Name</TableHead>
              <TableHead class="text-center">Route Color</TableHead>
              <TableHead class="w-[50px] text-center"> Route Grade </TableHead>
              <TableHead class="text-center">Route Setter</TableHead>
              <TableHead class="text-center">Route Date</TableHead>
              <TableHead class="text-center">Route link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="route in supabaseData.data"
              :key="route.id"
              class="bg-destructive"
            >
              <TableCell>{{ route.RID }}</TableCell>
              <TableCell class="text-nowrap">{{ route.zone_name }}</TableCell>
              <TableCell class="text-nowrap">{{ route.route_color }}</TableCell>
              <TableCell class="text-nowrap">{{ route.route_grade }}</TableCell>
              <TableCell class="text-nowrap">
                {{ route.route_setter }}
              </TableCell>
              <TableCell class="text-nowrap">
                {{
                  route.route_date
                    ? formatDateString(route.route_date)
                    : "no date"
                }}
              </TableCell>
              <TableCell>{{ route.route_link ? "link" : "nolink" }}</TableCell>
            </TableRow>
          </TableBody>
        </Table> -->
      </div>
    </div>
  </div>
</template>

<style scoped></style>
