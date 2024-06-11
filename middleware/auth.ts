export default defineNuxtRouteMiddleware((to, from) => {
	const user = useSupabaseUser();

	if (user && user.value && user.value.id) {
		return
	} else {
		throw createError({ statusCode: 401, fatal: true, statusMessage: 'Unauthorized' });
	}
});