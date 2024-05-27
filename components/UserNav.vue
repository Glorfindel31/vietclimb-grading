<script setup
		lang="ts">

			import { cn } from "~/lib/utils";

			const props = defineProps({
				logOutHandler: {
					type: Function,
					required: true,
				},
				class: {
					type: String,
					default: "",
				},
				mobile: {
					type: Boolean,
					default: false,
				},
			});
			const buttonClass = cn(props.class);
			const mobileClass = cn(
				props.mobile ? "flex flex-col gap-2" : "flex flex-row gap-2",
			);
</script>

<template>
	<div :class="mobileClass">
		<li>
			<Button as-child :class="buttonClass">
				<NuxtLink to="/user"> Profile </NuxtLink>
			</Button>
		</li>
		<li>
			<Button as-child variant="secondary" @click="props.logOutHandler" :class="buttonClass">
				<NuxtLink to="/login"> LogOut </NuxtLink>
			</Button>
		</li>
	</div>
</template>
