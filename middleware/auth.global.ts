export default defineNuxtRouteMiddleware((to, _from) => {

	const admin = useRuntimeConfig().public.admin;

	const publicRoutes = ['/', '/login', '/register', '/about', '/public'];
	const authRoutes = ['/', '/user', '/about', '/public'];
	const adminRoutes = ['/', '/about', '/public', '/admin'];
	const user = useSupabaseUser();

	if (!user.value && !publicRoutes.includes(to.path)) {
		return navigateTo('/login');
	} else if (user.value && !authRoutes.includes(to.path) && user.value?.id !== admin) {
		return navigateTo('/user');
	} else if (user.value && user.value?.id === admin && !adminRoutes.includes(to.path)) {
		return navigateTo('/admin')
	}
});
