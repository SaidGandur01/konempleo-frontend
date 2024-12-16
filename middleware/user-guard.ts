import { useUserStore } from "~/store/user.store";
import { EUser } from "~/utils/enum";

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();
  const userRole = userStore.getUserRole();
  const pathChunks = to.path.split("/");
  if (!userRole) {
    userStore.reset();
    return;
  }

  if (!pathChunks.includes(userRole)) {
    switch (userRole) {
      case EUser.SUPER_ADMIN:
        return navigateTo("/super-admin/companies");
      case EUser.ADMIN:
        return navigateTo("/admin/companies");
      case EUser.ADMIN_COMPANY:
        return navigateTo("/company-admin/offers");
      case EUser.COMPANY:
        return navigateTo("/company/offer-list");
      default:
        return userStore.reset();
    }
  }
});
