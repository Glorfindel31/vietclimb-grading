export default defineNuxtRouteMiddleware((to, from) => {

	const admin = useRuntimeConfig().public.admin;
	const user = useSupabaseUser();

	if (user && user.value && user.value.id === admin) {
		return
	} else {
		throw createError({ statusCode: 401, fatal: true, statusMessage: 'Unauthorized' });
	}
});