export default defineNuxtRouteMiddleware((_to, _from) => {
  const admin = useRuntimeConfig().public.admin
  const session = useSupabaseSession()

  if (session && session.value && session.value.user.id === admin) {
    return
  } else {
    throw createError({
      statusCode: 401,
      fatal: true,
      statusMessage: 'Unauthorized',
    })
  }
})
