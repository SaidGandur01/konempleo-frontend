import { useUserStore } from "~/store/user.store";

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();
  const isUserAuthenticated = userStore.isUserAuthenticated();
  if (!isUserAuthenticated) {
    return userStore.reset()
  }
});
