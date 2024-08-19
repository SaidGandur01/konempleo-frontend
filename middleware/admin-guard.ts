import { useUserStore } from "~/store/user.store";
import { EUser } from "~/utils/enum";

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  const userRole = userStore.getUserRole();
  console.log('admin guard: ', userRole)

  if(userRole !== EUser.ADMIN) {
    return navigateTo('/company/position')
  }
});
