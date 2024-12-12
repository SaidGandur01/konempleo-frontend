import { useUserStore } from "~/store/user.store";
import { EUser } from "~/utils/enum";

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();
  const userRole = userStore.getUserRole();
  console.log("company guard: ", userRole);

  if (!userRole) {
    userStore.reset();
    return;
  }

  if (userRole !== EUser.COMPANY) {
    if (userRole === EUser.ADMIN) {
      return navigateTo("/admin/companies");
    } else if (userRole === EUser.ADMIN_COMPANY) {
      return navigateTo("/company-admin/offers");
    } else {
      return navigateTo("/super-admin");
    }
  }
});
