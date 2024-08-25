import { useUserStore } from "~/store/user.store";
import { EUser } from "~/utils/enum";

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();
  const userRole = userStore.getUserRole();
  console.log('company guard: ', userRole);

  if (!userRole) {
    userStore.reset()
    return navigateTo('/login')
  }

  if(userRole !== EUser.COMPANY) {
    if (userRole === EUser.ADMIN) {
      return navigateTo('/admin/board')
    } else {
      return navigateTo('/super-admin')
    }
  }
});
