<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { UserWithTopRecordsAndRoutes } from '@/types/userTable.type'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const userData = ref<UserWithTopRecordsAndRoutes | null>(null)

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

watchEffect(() => {
  if (data.value) {
    userData.value = data.value
  }
})
</script>

<template>
  <div v-if="userData?.top_records" class="page-container">
    <div class="page-card gap-2">
      <div class="flex flex-row items-center justify-between border-b py-2">
        <h3 class="m-0">{{ userData.displayed_name }}'s climbing stats</h3>
        <div class="flex flex-row gap-2">
          <Button size="icon" variant="ghost" @click="refresh">
            <Icon icon="radix-icons:reload" class="h-6w-6" />
          </Button>
          <Button size="icon" variant="ghost" as-child>
            <NuxtLink to="/user">
              <Icon icon="radix-icons:arrow-left" class="h-6w-6" />
            </NuxtLink>
          </Button>
        </div>
      </div>
      <Tabs default-value="tops">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="tops">Your Tops</TabsTrigger>
          <TabsTrigger value="gradeChart">Grade chart</TabsTrigger>
        </TabsList>
        <TabsContent value="tops">
          <UserTopsContent :user-data="userData" />
        </TabsContent>
        <TabsContent value="gradeChart">
          <UserGradeChart :user-data="userData" />
        </TabsContent>
      </Tabs>
    </div>
  </div>
  <div v-else>Oupss</div>
</template>
