export default defineNuxtRouteMiddleware((_to, _from) => {
  const user = useSupabaseUser()

  if (!user || !user.value || !user.value.id) {
    throw createError({
      statusCode: 403,
      message: 'Access denied',
      fatal: true,
    })
  }
})
