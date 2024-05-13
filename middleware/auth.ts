export default defineNuxtRouteMiddleware((to, from) => {

          const publicRoutes = ['/', '/login', '/register', '/public', '/about']

          if (publicRoutes.includes(to.path)) {
            return
          }
     
        })
        