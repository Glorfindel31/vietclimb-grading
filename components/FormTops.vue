<script setup
		lang="ts">
			import type { Tables } from "~/types/supabase.type";
			import { toTypedSchema } from "@vee-validate/zod";
			import * as z from "zod";

			type RouteDataType = Tables<"routes">;

			const props = defineProps<{
				routeData: RouteDataType
			}>()

			const formSchema = z.object({
				isTop: z.boolean(),
				grade: z.string().min(1).max(7),
				rate: z.number().min(1).max(5),
			})

</script>

<template>
	<form action="" class="flex flex-col justify-center">

		<div class="flex flex-row items-center justify-center leading-none gap-2">
			<Checkbox id="terms" />
			<label for="terms"
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
				Check if you have top this route.
				<div class="italic pt-1 text-primary">Route can't be rated if not topped.</div>
			</label>
		</div>

		<div class="rate">
			<input type="radio" id="star5" name="rate" value="5" checked />
			<label for="star5" title="text">5 stars</label>
			<input type="radio" id="star4" name="rate" value="4" />
			<label for="star4" title="text">4 stars</label>
			<input type="radio" id="star3" name="rate" value="3" />
			<label for="star3" title="text">3 stars</label>
			<input type="radio" id="star2" name="rate" value="2" />
			<label for="star2" title="text">2 stars</label>
			<input type="radio" id="star1" name="rate" value="1" />
			<label for="star1" title="text">1 star</label>
		</div>

		<NumberField id="grade" :default-value="props.routeData.route_grade ? props.routeData.route_grade : 1" :min="1"
			:max="7" class="w-24">
			<Label for="grade">Grade</Label>
			<NumberFieldContent>
				<NumberFieldDecrement />
				<NumberFieldInput />
				<NumberFieldIncrement />
			</NumberFieldContent>
		</NumberField>

		<Button variant="secondary" class="w-fit self-center">
			Top it!
		</Button>

	</form>
</template>

<style lang="css"
	   scoped>

		.rate {
			display: flex;
			flex-direction: row-reverse;
			justify-content: center;
			align-items: center;
			height: 3rem;
		}

		.rate:not(:checked)>input {
			position: absolute;
			top: -9999px;
		}

		.rate:not(:checked)>label {
			float: right;
			width: 1em;
			overflow: hidden;
			white-space: nowrap;
			cursor: pointer;
			font-size: 2rem;
			color: hsl(var(--foreground));
		}

		.rate:not(:checked)>label:before {
			content: '★ ';
		}

		.rate>input:checked~label {
			color: hsl(var(--primary));
		}

		.rate:not(:checked)>label:hover,
		.rate:not(:checked)>label:hover~label {
			color: hsl(var(--secondary));
		}

		.rate>input:checked+label:hover,
		.rate>input:checked+label:hover~label,
		.rate>input:checked~label:hover,
		.rate>input:checked~label:hover~label,
		.rate>label:hover~input:checked~label {
			color: hsl(var(--secondary));
		}
	</style>