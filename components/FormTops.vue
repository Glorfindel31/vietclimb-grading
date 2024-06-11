<script setup
		lang="ts">
			import type { Tables, Database } from "~/types/supabase.type";
			import { toTypedSchema } from "@vee-validate/zod";
			import { useForm } from "vee-validate";
			import { Icon } from "@iconify/vue";
			import * as z from "zod";
			import { stringCompressor } from "~/helpers/helpFunctions";
			import { useToast } from '@/components/ui/toast/use-toast'
			import { type UserWithTopRecords } from "~/pages/user/index.vue";


			const { toast } = useToast()

			type RouteDataType = Tables<"routes">;

			const props = defineProps<{
				routeData: RouteDataType;
				userData: UserWithTopRecords;
				refresh: () => void;
			}>();

			const supabase = useSupabaseClient<Database>();

			const formSchema = toTypedSchema(
				z.object({
					isTop: z.boolean().refine((value) => value === true, {
						message: "You must have topped the route to submit a rating or a grade.",
					}),
					grade: z
						.number()
						.min(1)
						.max(7)
						.default(props.routeData.route_grade ? props.routeData.route_grade : 1),
					rate: z.enum(["1", "2", "3", "4", "5"]).default("5"),
				}),
			);

			const { handleSubmit, setFieldValue } = useForm({
				validationSchema: formSchema,
			});

			const onSubmit = handleSubmit(async (values) => {
				const { grade, rate } = values;
				const URID = props.routeData.URID;
				const UID = props.userData.UID;

				if (values.isTop && values.grade && values.rate && URID && UID) {
					const { data, error } = await supabase
						.from("top_records")
						.insert(
							{
								URID_linked: URID,
								user_grade: grade,
								user_rate: Number(rate),
								UID_linked: UID,
								TUID: stringCompressor(URID + UID),
							}
						).select()
					if (data) {
						toast({
							title: 'Ascent logged',
							description: `Really good! Keep climbing ${props.userData.displayed_name}!`,
						});
						props.refresh();
					} else {
						if (error.code === "23505") {
							toast({
								title: 'Ascent already logged',
								description: `You have already logged this ascent ${props.userData.displayed_name}!`,
							});
						} else {
							toast({
								title: 'Error',
								description: `There was an error logging the ascent ${props.userData.displayed_name}!`,
							});
						}
					}
				} else {
					toast({
						title: 'Error',
						description: `You must have topped the route to submit a rating or a grade.`,
					});
				}
			});

</script>

<template>
	<form @submit="onSubmit" class="flex flex-col justify-center gap-6">

		<FormField v-slot="{ value, handleChange }" type="checkbox" name="isTop">
			<FormItem class="flex flex-row items-center justify-center gap-4">
				<FormControl>
					<Checkbox :checked="value" @update:checked="handleChange" />
				</FormControl>
				<FormLabel
					class="text-sm text-left font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
					Top Check
					<div class="pt-1 italic text-muted text-xs">
						Route can't be rated if not topped.
					</div>
				</FormLabel>
				<FormMessage class="px-4 text-xs" />
			</FormItem>
		</FormField>

		<FormField v-slot="{ componentField }" type="radio" name="rate">
			<div class="flex items-center justify-center text-center">
				<FormItem>
					<FormLabel>Rate the route</FormLabel>
					<FormControl>
						<RadioGroup class="flex flex-row space-x-1" v-bind="componentField">
							<FormItem class="flex flex-col items-center gap-x-3 space-y-0">
								<FormControl>
									<RadioGroupItem value="1" />
								</FormControl>
								<FormLabel class="font-normal"> 1 </FormLabel>
							</FormItem>
							<FormItem class="flex flex-col items-center gap-x-3 space-y-0">
								<FormControl>
									<RadioGroupItem value="2" />
								</FormControl>
								<FormLabel class="font-normal"> 2 </FormLabel>
							</FormItem>
							<FormItem class="flex flex-col items-center gap-x-3 space-y-0">
								<FormControl>
									<RadioGroupItem value="3" />
								</FormControl>
								<FormLabel class="font-normal"> 3 </FormLabel>
							</FormItem>
							<FormItem class="flex flex-col items-center gap-x-3 space-y-0">
								<FormControl>
									<RadioGroupItem value="4" />
								</FormControl>
								<FormLabel class="font-normal"> 4 </FormLabel>
							</FormItem>
							<FormItem class="flex flex-col items-center gap-x-3 space-y-0">
								<FormControl>
									<RadioGroupItem value="5" />
								</FormControl>
								<FormLabel class="font-normal"> 5 </FormLabel>
							</FormItem>
						</RadioGroup>
					</FormControl>
					<FormMessage />
				</FormItem>
			</div>
		</FormField>



		<FormField name="grade">
			<FormItem class="flex w-24 flex-col items-center justify-center self-center">
				<FormLabel>Grade</FormLabel>
				<NumberField :default-value="props.routeData.route_grade ? props.routeData.route_grade : 1
					" :min="1" :max="7" @update:model-value="(v) => {
						if (v) {
							setFieldValue('grade', v);
						} else {
							setFieldValue('grade', 1);
						}
					}
						">
					<NumberFieldContent>
						<NumberFieldDecrement />
						<NumberFieldInput />
						<NumberFieldIncrement />
					</NumberFieldContent>
				</NumberField>
			</FormItem>
		</FormField>
		<DrawerClose asChild>
			<Button class="self-center" type="submit" variant="outline" size="icon">
				<Icon icon="radix-icons:check" class="w-6 h-6" />
			</Button>
		</DrawerClose>
	</form>
</template>

<style lang="css"
	   scoped></style>
