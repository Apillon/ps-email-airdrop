export default defineNuxtPlugin(() => {
  const user = useUserStore();
  if (user.jwt) {
    $api.setToken(user.jwt);
    user.refresh();
  } else {
    user.logout();
  }
});
