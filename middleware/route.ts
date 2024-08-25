import { useUserStore } from "~/store/user.store";
import { EUser } from "~/utils/enum";

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();
  const userRole = userStore.getUserRole();
  console.log("route guard: ", userRole);

  switch (userRole) {
    case EUser.ADMIN:
      return navigateTo("/admin/board");
    case EUser.COMPANY:
      return navigateTo("/company/create-offer");
    case EUser.SUPER_ADMIN:
      return navigateTo("/company/create-offer");
    default:
      return navigateTo("/company/create-offer");
  }
});
