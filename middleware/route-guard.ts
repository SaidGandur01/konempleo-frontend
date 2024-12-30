export default defineNuxtRouteMiddleware(async (to, from) => {
  const path = from.path;

  switch (path) {
    case "/admin":
      return navigateTo("/admin/companies");
    case "/company-admin/":
      return navigateTo("/company-admin/offers");
    case "/super-admin":
      return navigateTo("/super-admin/companies");
    default:
    case "/company":
      return navigateTo("/company/create-offer");
  }
});
