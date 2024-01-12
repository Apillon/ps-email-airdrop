/**
 * Use in page components:
    definePageMeta({
      middleware: 'authenticated',
    });
 */
export default defineNuxtRouteMiddleware(_to => {
  const user = useUserStore();

  if (process?.server) {
    return;
  }

  if (!user.loggedIn) {
    return navigateTo('/');
  }
});
