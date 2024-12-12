import { EUser } from "../enum";

export const getUserHeaderText = (userRole: EUser) => {
  switch (userRole) {
    case EUser.SUPER_ADMIN:
      return "SUPER ADMIN";
    case EUser.ADMIN:
      return "ADMIN";
    case EUser.ADMIN_COMPANY:
      return "EMPRESA";
    default:
    case EUser.COMPANY:
      return "RECLUTADOR";
  }
};

export const getUserRoleNavMapping = (userRole: EUser) => {
  switch (userRole) {
    case EUser.ADMIN:
      return [
        {
          label: "Lista de Empresas",
          icons: ["fas", "list-check"],
          redirect: "/admin/companies",
        },
        {
          label: "Ofertas por Empresa",
          icons: ["fas", "building"],
          redirect: "/admin/offer-details",
        },
        {
          label: "Lista de ofertas",
          icons: ["fas", "list-check"],
          redirect: "/admin/offers",
        },
        {
          label: "Crear Empresa",
          icons: ["fas", "house-flag"],
          redirect: "/admin/create-company",
        },
      ];
    case EUser.ADMIN_COMPANY:
      return [
        {
          label: "Lista de ofertas",
          icons: ["fas", "list-check"],
          redirect: "/company-admin/offers",
        },
        {
          label: "Detalle de oferta",
          icons: ["fas", "chart-column"],
          redirect: "/company-admin/offer-details",
        },
        {
          label: "Crear oferta",
          icons: ["fas", "list-check"],
          redirect: "/company-admin/create-offer",
        },
        {
          label: "Carga CV's",
          icons: ["far", "file"],
          redirect: "/company-admin/load-cvs",
        },
        {
          label: "Crear Usuario",
          icons: ["fas", "users"],
          redirect: "/company-admin/create-user",
        },
        {
          label: "Lista de usuarios",
          icons: ["fas", "people-group"],
          redirect: "/company-admin/users",
        },
      ];
    case EUser.SUPER_ADMIN:
      return [
        {
          label: "Lista de Empresas",
          icons: ["fas", "list-check"],
          redirect: "/super-admin/companies",
        },
        {
          label: "Ofertas por empresa",
          icons: ["fas", "building"],
          redirect: "/super-admin/offer-details",
        },
        {
          label: "Lista de ofertas",
          icons: ["fas", "list-check"],
          redirect: "/super-admin/offers",
        },
        {
          label: "Crear Empresa",
          icons: ["fas", "house-flag"],
          redirect: "/super-admin/create-company",
        },
        {
          label: "Crear Usuario",
          icons: ["fas", "users"],
          redirect: "/super-admin/create-user",
        },
        {
          label: "Lista de usuarios",
          icons: ["fas", "people-group"],
          redirect: "/super-admin/users",
        },
      ];

    default:
    case EUser.COMPANY:
      return [
        {
          label: "Lista de ofertas",
          icons: ["fas", "hippo"],
          redirect: "/company/offer-list",
        },
        {
          label: "Detalle de oferta",
          icons: ["fas", "chart-column"],
          redirect: "/company/offer-details",
        },
        {
          label: "Crear oferta",
          icons: ["fas", "user-tie"],
          redirect: "/company/create-offer",
        },
        {
          label: "Carga CV's",
          icons: ["far", "file"],
          redirect: "/company/load-cvs",
        },
      ];
  }
};
