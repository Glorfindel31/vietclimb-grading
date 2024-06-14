export default defineNuxtRouteMiddleware((_to, _from) => {
  const session = useSupabaseSession()

  if (!session || !session.value || !session.value.user.id) {
    throw createError({
      statusCode: 403,
      message: 'Access denied',
      fatal: true,
    })
  }
})
