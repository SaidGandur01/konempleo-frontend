import { useUserStore } from "~/store/user.store";
import { EUser } from "~/utils/enum";

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();
  const userRole = userStore.getUserRole();
  console.log("admin guard: ", userRole);

  if (!userRole) {
    userStore.reset();
    return;
  }

  if (userRole !== EUser.ADMIN) {
    if (userRole === EUser.COMPANY) {
      return navigateTo("/company/create-offer");
    } else if (userRole === EUser.ADMIN_COMPANY) {
      return navigateTo("/company-admin/offers");
    } else {
      return navigateTo("/super-admin");
    }
  }
});
