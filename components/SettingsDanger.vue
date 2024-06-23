<script setup lang="ts"></script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="text-destructive">Danger Zone</CardTitle>
      <CardDescription>Irreversible zone beware!</CardDescription>
    </CardHeader>
    <CardContent class="flex flex-col gap-4">
      <!-- remove logs -->
      <SettingsDangerRemoveLogs />
      <!-- remove account -->
      <SettingsDangerRemoveAccount />
    </CardContent>
    <CardFooter class="py-4 italic">Remember this is irreversible</CardFooter>
  </Card>
</template>
