import { useUserStore } from "~/store/user.store";

// middleware/roleCheck.js
export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();

  // Assuming some method exists to sync or fetch auth status, which might be server-side or from a cookie
  // await userStore.syncAuthStatus();

  if (!userStore.isUserAuthenticated()) {
    return navigateTo('/login');
  }

  const isAdminUser = userStore.isAdmin();
  console.log({isAdminUser})
  const requiredRoles = to.meta.roles;
  
  if (requiredRoles && !requiredRoles.includes(isAdminUser ? 'admin' : 'company')) {
    return navigateTo('/unauthorized');
  }
});
