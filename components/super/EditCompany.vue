<template>
  <div class="create-company">
    <h2>Editar Empresa</h2>
    <div class="content">
      <div class="first-column">
        <div class="form-field">
          <CoreInput
            id="company-name-id"
            name="text"
            min-length="2"
            label="Nombre de la Empresa"
            :placeholder="
              currentCompany && currentCompany.name
                ? currentCompany.name
                : 'Nombre de la Empresa'
            "
            required
            type="text"
            @input="(data) => handleOnInput('company_name', data)"
          />
          <span v-if="form.company_name.length < 3" class="error-message">{{
            companyNameError
          }}</span>
        </div>
        <div class="form-field">
          <CoreDropdown
            :list-options="companyDocumentTypeListData"
            label="Tipo de Documento"
            :placeholder="
              currentCompany && currentCompany.document_type
                ? currentCompany.document_type
                : 'Seleccione una opción'
            "
            @select="(data) => handleOnInput('company_document_type', data)"
          />
          <span v-if="!form.company_document_type" class="error-message">{{
            companyDocumentTypeError
          }}</span>
        </div>
        <div class="form-field">
          <CoreInput
            id="document-id"
            name="text"
            min-length="2"
            label="Numero de Documento"
            :placeholder="
              currentCompany && currentCompany.document
                ? currentCompany.document
                : ''
            "
            required
            type="text"
            @input="(data) => handleOnInput('document_number', data)"
          />
          <span v-if="form.document_number.length < 3" class="error-message">{{
            documentNumberError
          }}</span>
        </div>
        <div class="form-field">
          <CoreDropdown
            :list-options="cityListData"
            label="Ciudad"
            :placeholder="
              currentCompany && currentCompany.city
                ? currentCompany.city
                : 'Seleccione una ciudad'
            "
            @select="(data) => handleOnInput('city', data)"
          />
          <span v-if="!form.city" class="error-message">{{ cityError }}</span>
        </div>
        <div class="form-field">
          <CoreInput
            id="sector-id"
            name="text"
            min-length="2"
            label="Sector"
            :placeholder="
              currentCompany && currentCompany.sector
                ? currentCompany.sector
                : 'Nombre del Sector'
            "
            required
            type="text"
            @input="(data) => handleOnInput('sector', data)"
          />
          <span v-if="form.sector.length < 3" class="error-message">{{
            sectorError
          }}</span>
        </div>
        <div class="form-field">
          <CoreDropdown
            :list-options="employessRangeListData"
            label="Número de empleados"
            :placeholder="
              currentCompany && currentCompany.employees
                ? currentCompany.employees
                : 'Seleccione un rango'
            "
            @select="(data) => handleOnInput('employees', data)"
          />
          <span v-if="!form.employees" class="error-message">{{
            employeesError
          }}</span>
        </div>
        <div class="form-field">
          <CoreInput
            id="user-company-name-id"
            name="text"
            min-length="2"
            label="Nombre de Usuario Empresa"
            :placeholder="
              currentCompany && currentCompany.recruiter_name
                ? currentCompany.recruiter_name
                : 'Nombre de Usuario de la Empresa'
            "
            required
            type="text"
            @input="(data) => handleOnInput('user_company_name', data)"
          />
          <span
            v-if="form.user_company_name.length < 3"
            class="error-message"
            >{{ userCompanyNameError }}</span
          >
        </div>
        <div class="form-field">
          <CoreInput
            id="user-company-email-id"
            name="text"
            min-length="2"
            label="Mail Usuario Empresa"
            :placeholder="
              currentCompany && currentCompany.recruiter_email
                ? currentCompany.recruiter_email
                : 'Email de Usuario de la Empresa'
            "
            required
            type="text"
            @input="(data) => handleOnInput('user_company_email', data)"
          />
          <span
            v-if="
              !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                form.user_company_email
              )
            "
            class="error-message"
            >{{ userCompanyEmailError }}</span
          >
        </div>
        <div class="form-field">
          <CoreInput
            id="user-company-name-id"
            name="text"
            min-length="2"
            label="Teléfono usuario Empresa"
            placeholder=""
            required
            type="number"
            @input="(data) => handleOnInput('user_company_phone', data)"
          />
          <span
            v-if="form.user_company_phone.length < 3"
            class="error-message"
            >{{ userCompanyPhoneError }}</span
          >
        </div>
        <div class="form-field">
          <CoreDropdown
            :list-options="userDropdownOptions"
            label="Persona Responsable en KonEmpleo"
            placeholder="Seleccione una opción"
            :should-emit-id="true"
            max-height="200px"
            @select="(data) => handleOnInput('konempleo_contact', data)"
          />
          <span v-if="!form.konempleo_contact" class="error-message">{{
            konEmpleoContactError
          }}</span>
        </div>
        <div class="form-field">
          <CoreInput
            id="company-offers-id"
            name="number"
            min-length="2"
            label="Número de ofertas para la empresa"
            required
            type="number"
            :placeholder="currentCompany && currentCompany.totaloffers"
            :value="
              currentCompany && currentCompany.totaloffers
                ? undefined
                : form.company_offers
            "
            @input="(data) => handleOnInput('company_offers', data)"
          />
          <span v-if="form.company_offers < 0" class="error-message">{{
            companyOffersError
          }}</span>
        </div>
        <div class="button">
          <CoreButton
            size="sm"
            label="Editar Empresa"
            :disabled="disableButton"
            @click="onUpdateCompany"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { cityListData } from "~/data/city/city";
import { companyDocumentTypeListData } from "~/data/document-type-company/document-type-company";
import { employessRangeListData } from "~/data/employess-range/employess-range";
import { useHelperStore } from "~/store/helper.store";
import { useUserStore } from "~/store/user.store";
import { getPUTCompanyPayload, isValidEmail } from "~/utils/helpers/common";

interface IEditCompanyForm {
  company_name: string;
  sector: string;
  user_company_name: string;
  user_company_email: string;
  konempleo_contact: string;
  document_number: string;
  city: string;
  user_company_phone: string;
  company_document_type: string;
  company_offers: number;
  employees: string;
}
interface IEditCompanyProps {
  companyId: string;
}

const props = withDefaults(defineProps<IEditCompanyProps>(), {
  companyId: "",
});
const form = ref<IEditCompanyForm>({
  company_name: "",
  sector: "",
  user_company_name: "",
  user_company_email: "",
  company_document_type: "",
  document_number: "",
  city: "",
  user_company_phone: "",
  konempleo_contact: "",
  company_offers: 0,
  employees: "",
});
const companyNameError = ref<string>("");
const companyDocumentTypeError = ref<string>("");
const documentNumberError = ref<string>("");
const cityError = ref<string>("");
const sectorError = ref<string>("");
const employeesError = ref<string>("");
const userCompanyNameError = ref<string>("");
const userCompanyEmailError = ref<string>("");
const userCompanyPhoneError = ref<string>("");
const konEmpleoContactError = ref<string>("");
const companyOffersError = ref<string>("");
const disableButton = ref<boolean>(true);
const userDropdownOptions = ref([]);
const currentCompany = ref();
const helperStore = useHelperStore();
const { $toast } = useNuxtApp();
const userStore = useUserStore();
const token = userStore.getToken();

const onUpdateCompany = async () => {
  const company = {
    ...currentCompany.value,
    name: form.value.company_name,
    sector: form.value.sector,
    document: form.value.document_number,
    document_type: form.value.company_document_type,
    city: form.value.city,
    totaloffers: Number(currentCompany.value.totaloffers) + Number(form.value.company_offers),
    availableoffers:
      Number(currentCompany.value.totaloffers) + Number(form.value.company_offers),
    employees: form.value.employees,
    recruiter_name: form.value.user_company_name,
    recruiter_email: form.value.user_company_email,
    phone: form.value.user_company_phone,
  };

  const params: fetchWrapperProps = {
    method: EFetchMethods.PUT,
    path: `company/${props.companyId}`,
    body: JSON.stringify(
      getPUTCompanyPayload({
        company,
        KOEUserId: Number(form.value.konempleo_contact),
      })
    ),
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "Something went wrong updating company",
    });
  } else {
    helperStore.renderToastMessage($toast, false, {
      success: "Compañia actualizada correctamente",
    });
    setTimeout(() => {
      navigateTo("/super-admin/companies");
    }, 1500);
    console.log(data);
  }
};

const fetchCompany = async (companyId: number) => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `company/${companyId}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing Companies data",
    });
    currentCompany.value = undefined;
  } else {
    const mappedCompany = data.value;
    currentCompany.value = mappedCompany;
  }
};

onMounted(async () => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: "users/",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing Users data",
    });
  } else {
    const response = data.value
      .filter((user: any) => user.role === 2)
      .reduce((acc , user) => {
        acc.push({ key: user.id, value: user.fullname });
        return acc;
      }, []);
    userDropdownOptions.value = response;
  }
});

const handleOnInput = (keyField: string, value: string | string[]): void => {
  form.value = {
    ...form.value,
    [keyField]: value,
  };
  validateErrorsForm(keyField, value);
  validateForm();
};

const validateErrorsForm = (
  keyField: string,
  value: string | string[]
): void => {
  switch (keyField) {
    case "company_name":
      companyNameError.value =
        value.length < 3 ? "Inserta un nombre válido" : "";
      break;
    case "sector":
      sectorError.value = value.length < 3 ? "Inserta un sector válido" : "";
      break;
    case "document_number":
      documentNumberError.value =
        value.length < 3 ? "Inserta un valor válido" : "";
      break;
    case "user_company_phone":
      userCompanyPhoneError.value =
        value.length < 3 ? "Inserta un valor válido" : "";
      break;
    case "user_company_name":
      userCompanyNameError.value =
        value.length < 3 ? "Inserta un username válido" : "";
      break;
    case "user_company_email":
      if (!isValidEmail(value)) {
        userCompanyEmailError.value = "Ingresa un email válido";
      } else {
        userCompanyEmailError.value = "";
      }
      break;
    case "konempleo_contact":
      konEmpleoContactError.value =
        isNaN(Number(value)) || Number(value) < 1
          ? "Selecciona una opción"
          : "";
      break;
    case "city":
      cityError.value = !value.trim().length ? "Selecciona una opción" : "";
      break;
    case "employees":
      employeesError.value = !value.length ? "Selecciona una opción" : "";
      break;
    case "company_document_type":
      companyDocumentTypeError.value = !value.length
        ? "Selecciona una opción"
        : "";
      break;
    case "company_offers":
      companyOffersError.value =
        isNaN(Number(value)) || Number(value) < 0
          ? "Inserta un valor válido"
          : "";
      break;
    default:
      break;
  }
};

const validateForm = (): void => {
  const isCompanyNameValid =
    form.value.company_name.length >= 3 && companyNameError.value === "";
  const isSectorValid =
    form.value.sector.length >= 3 && sectorError.value === "";
  const isDocumentNumberValid =
    form.value.document_number.length >= 3 && documentNumberError.value === "";
  const isUserCompanyPhoneValid =
    form.value.user_company_phone.length >= 3 &&
    userCompanyPhoneError.value === "";
  const isUserCompanyNameValid =
    form.value.user_company_name.length >= 3 &&
    userCompanyNameError.value === "";
  const isKonEmpleoContactValid =
    !isNaN(Number(form.value.konempleo_contact)) &&
    Number(form.value.konempleo_contact) >= 1 &&
    konEmpleoContactError.value === "";
  const isCityValid =
    form.value.city.trim().length > 0 && cityError.value === "";
  const isEmployeesValid =
    form.value.employees.trim().length > 0 && employeesError.value === "";
  const isCompanyDocumentTypeValid =
    form.value.company_document_type.trim().length > 0 &&
    companyDocumentTypeError.value === "";
  const isCompanyOffersValid =
    !isNaN(Number(form.value.company_offers)) &&
    Number(form.value.company_offers) >= 1 &&
    companyOffersError.value === "";

  disableButton.value = !(
    isCompanyNameValid &&
    isSectorValid &&
    isUserCompanyNameValid &&
    isValidEmail(form.value.user_company_email) &&
    isKonEmpleoContactValid &&
    isCompanyOffersValid &&
    isCompanyDocumentTypeValid &&
    isDocumentNumberValid &&
    isCityValid &&
    isEmployeesValid &&
    isUserCompanyPhoneValid
  );
};

watch(
  () => props.companyId,
  async (newCompanyId: string) => {
    if (newCompanyId) await fetchCompany(Number(newCompanyId));
  }
);
</script>
<style lang="scss" scoped>
.create-company {
  border-radius: 1rem;
  background-color: var(--background-color-secondary);
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  width: 100%;

  .content {
    display: flex;
    width: 100%;
    padding-bottom: 2rem;

    .first-column {
      width: 60%;
    }

    .first-column {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }
  }

  h2 {
    font-size: 1.7rem;
  }

  .form-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 3rem;
  }
}
</style>
