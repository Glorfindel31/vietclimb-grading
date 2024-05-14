export default defineNuxtRouteMiddleware((to, _from) => {

  const publicRoutes = [ '/','/login', '/register', '/about','/public'];
  const user = useSupabaseUser();

  if (!user.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/login');    
    }
});
