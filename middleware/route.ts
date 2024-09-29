import { useUserStore } from "~/store/user.store";
import { EUser } from "~/utils/enum";

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();
  const userRole = userStore.getUserRole();
  console.log("route guard: ", userRole);

  switch (userRole) {
    case EUser.ADMIN:
      return navigateTo("/admin/companies");
    case EUser.ADMIN_COMPANY:
      return navigateTo("/company-admin/offers");
    case EUser.COMPANY:
      return navigateTo("/company/create-offer");
    case EUser.SUPER_ADMIN:
      return navigateTo("/super-admin/companies");
    default:
      return navigateTo("/company/create-offer");
  }
});
