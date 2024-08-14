import { useUserStore } from "~/store/user.store";

export default defineNuxtRouteMiddleware(async () => {
  const userStore = useUserStore();
  // TODO: Call API to get user role.
  // const isAdmin = userStore.isAdmin();
  const userRole: boolean = true;

  userStore.setUserType(userRole);
});

