<script setup
		lang="ts">

			const user = useSupabaseUser()
			console.log(user.value)
</script>

<template>
	<h1>hello user </h1>
</template>

<style scoped></style>
