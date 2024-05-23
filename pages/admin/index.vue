<script setup lang="ts">
import TableHead from "~/components/ui/table/TableHead.vue";
import type { Database } from "~/database.types";

const supabase = useSupabaseClient<Database>();

const googleData = await useFetch("/api/googlesheet");
const supabaseData = await supabase.from("routes").select("*");

const googleRoutes: any | undefined = ref([]);
if (googleData.data.value && "transformedValues" in googleData.data.value) {
  googleRoutes.value = googleData.data.value.transformedValues;
} else {
  console.error("transformedValues does not exist on this type");
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const year = date.getFullYear().toString().slice(2);
  return `${day}/${month}/${year}`;
};
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
        <Table class="rounded border p-1 text-center text-xs">
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
            <TableRow v-for="route in googleRoutes" :key="route.id">
              <TableCell>{{ route.id }}</TableCell>
              <TableCell class="text-nowrap">{{ route.name }}</TableCell>
              <TableCell class="text-nowrap">{{ route.color }}</TableCell>
              <TableCell class="text-nowrap">{{ route.grade }}</TableCell>
              <TableCell class="text-nowrap">{{ route.setter }}</TableCell>
              <TableCell>{{
                route.date ? formatDate(route.date) : "no date"
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
            <TableRow v-for="route in supabaseData.data" :key="route.id">
              <TableCell>{{ route.RID }}</TableCell>
              <TableCell class="text-nowrap">{{ route.zone_name }}</TableCell>
              <TableCell class="text-nowrap">{{ route.route_color }}</TableCell>
              <TableCell class="text-nowrap">{{ route.route_grade }}</TableCell>
              <TableCell class="text-nowrap">
                {{ route.route_setter }}
              </TableCell>
              <TableCell class="text-nowrap">
                {{
                  route.route_date ? formatDate(route.route_date) : "no date"
                }}
              </TableCell>
              <TableCell>{{ route.route_link ? "link" : "nolink" }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
