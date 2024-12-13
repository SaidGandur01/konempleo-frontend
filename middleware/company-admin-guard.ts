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

  if (userRole !== EUser.ADMIN_COMPANY) {
    if (userRole === EUser.COMPANY) {
      return navigateTo("/company/create-offer");
    } else if (userRole === EUser.ADMIN) {
      return navigateTo("/admin/companies");
    } else {
      return navigateTo("/super-admin");
    }
  }
});
