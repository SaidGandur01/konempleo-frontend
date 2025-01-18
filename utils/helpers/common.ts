import { EUser } from "../enum";

export const formatSalary = (salary: string) => {
  const salaryRanges = salary.split(",");
  const formattedSalary = salaryRanges.map((range) => {
    const trimmedStr = range.trim();
    return `$${trimmedStr.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  });
  return formattedSalary.join(' - ');
};

export const roleMapFromToken = (role: number): EUser | null => {
  switch (role) {
    case 1:
      return EUser.SUPER_ADMIN;
    case 2:
      return EUser.ADMIN;
    case 3:
      return EUser.ADMIN_COMPANY;
    case 4:
      return EUser.COMPANY;
    default:
      return null;
  }
};

export const isValidEmail = (value: any): boolean => {
  if (!value) return false;
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value))
    return false;
  return true;
};

export const getCreateCompanyPayload = (data: any, KOEId?: number ) => {
  const formattedPayload = {
    employees: parseInt(data.employees.split("-")[1]) || 0,
    sector: data.sector,
    city: data.city,
    name: data.company_name,
    konempleo_responsible: data.konempleo_contact || KOEId,
    responsible_user: {
      fullname: data.user_company_name,
      email: data.user_company_email,
      role: 3,
      phone: data.user_company_phone,
    },
    document: data.document_number,
    availableoffers: data.company_offers,
    totaloffers: data.company_offers,
    activeoffers: 0,
    document_type: data.company_document_type,
  };
  return formattedPayload;
};

export const getCreateUserPayload = (
  user: any,
  isRecruiter: boolean = false
) => {
  if (isRecruiter) {
    return {
      email: user.email,
      fullname: user.name,
      phone: user.phone,
      role: 4,
    };
  }
  return {
    user_in: {
      email: user.email,
      fullname: user.name,
      phone: user.phone,
      role: user.role,
    },
    company_ids: user.companies,
  };
};

type TCompanyPUT = {
  company: any;
  KOEUserId: number;
  companyUser?: any;
  updateActive?: boolean;
  updateDeleted?: boolean;
};

export const getPUTCompanyPayload = ({
  company,
  updateActive,
  updateDeleted,
  KOEUserId,
  companyUser,
}: TCompanyPUT) => {
  const payload = {
    name: company.name,
    sector: company.sector,
    document: company.document,
    document_type: company.document_type,
    city: company.city,
    employees: Number(company.employees)
      ? company.employees
      : parseInt(company.employees.split("-")[1]),
    availableoffers: company.availableoffers,
    totaloffers: company.totaloffers,
    konempleo_responsible: KOEUserId,
    responsible_user: {
      fullname: companyUser?.fullname || company.recruiter_name,
      email: companyUser?.email || company.recruiter_email,
      phone: companyUser?.phone || company.phone,
    },
    is_deleted: company.is_deleted,
    active: company.active,
  };
  if (updateActive) {
    payload.active = !company.active;
    return payload;
  } else if (updateDeleted) {
    payload.is_deleted = !company.is_deleted;
    return payload;
  }

  return payload;
};

type TUsersPUT = { user: any; updateActive?: boolean; updateDeleted?: boolean };

export const getPUTUserPayload = ({
  user,
  updateActive,
  updateDeleted,
}: TUsersPUT) => {
  const payload = {
    user_in: {
      fullname: user.fullname,
      phone: user.phone,
      email: user.email,
      is_deleted: user.is_deleted,
      active: user.active,
    },
    company_ids: user.companies,
  };
  if (updateActive) {
    payload.user_in.active = !user.active;
    return payload;
  } else if (updateDeleted) {
    payload.user_in.is_deleted = !user.is_deleted;
    return payload;
  }
  return payload;
};

export const isValidToken = (token: any) => {
  const currentTimeStamp = Math.floor(Date.now() / 1000);
  const isExpired = currentTimeStamp > token.exp;
  if (isExpired) return false;
  return true;
};

export const getUserHeaderText = (userRole: EUser | null) => {
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
          label: "Detalle de Ofertas",
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
          label: "Importar CV's",
          icons: ["fas", "download"],
          redirect: "/company-admin/import-cvs",
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
          label: "Detalle de Ofertas",
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
          redirect: "/company/offers",
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
        {
          label: "Importar CV's",
          icons: ["fas", "download"],
          redirect: "/company/import-cvs",
        },
      ];
  }
};
