import { useUserStore } from "~/store/user.store";
import { EUser } from "~/utils/enum";

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  const userRole = userStore.getUserRole();
  console.log('company guard: ', userRole)

  if(userRole !== EUser.COMPANY) {
    return navigateTo('/admin/board')
  }
});
