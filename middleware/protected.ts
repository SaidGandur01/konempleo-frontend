import { useUserStore } from "~/store/user.store";

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  const isUserAuthenticated = userStore.isUserAuthenticated();

  if (!isUserAuthenticated) {
    return navigateTo("/login");
  }

  const requiredRoles = to.meta.roles;
  console.log({requiredRoles})
  if (requiredRoles && !requiredRoles.includes(userStore.getUserRole())) {
    return navigateTo('/home');
  }
});
