import { useUserStore } from "~/store/user.store";
import { EUser } from "~/utils/enum";

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();
  const userRole = userStore.getUserRole();
  console.log('super admin guard: ', userRole)

  if (!userRole) {
    userStore.reset()
    return navigateTo('/login')
  }

  if(userRole !== EUser.SUPER_ADMIN) {
    if (userRole === EUser.COMPANY) {
      return navigateTo('/company/create-offer')
    } else {
      return navigateTo('/admin/board')
    }
  }
});
