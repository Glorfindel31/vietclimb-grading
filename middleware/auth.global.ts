export default defineNuxtRouteMiddleware((to, from) => {
	const admin = useRuntimeConfig().public.admin;
	const user = useSupabaseUser();

	const publicRoutes = ['/', '/login', '/register', '/about', '/public'];
	const alwaysAllowedRoutes = ['/', '/about', '/public'];
	const authRoutesBase = ['/user'];
	const adminRoutesBase = ['/admin'];

	const isMatchingRoute = (basePath: string[], routePath: string): boolean => {
		return basePath.some(basePathSegment => routePath.startsWith(basePathSegment));
	};

	if (!user.value && !publicRoutes.includes(to.path)) {
		return navigateTo('/login');
	} else if (user.value && alwaysAllowedRoutes.includes(to.path)) {
		return;
	} else if (user.value && user.value.id !== admin && !isMatchingRoute(authRoutesBase, to.path)) {
		return navigateTo('/user');
	} else if (user.value && user.value.id === admin && !isMatchingRoute(adminRoutesBase, to.path)) {
		return navigateTo('/admin');
	} else {
		return;
	}
});