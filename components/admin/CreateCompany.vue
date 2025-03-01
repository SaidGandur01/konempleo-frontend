<template>
  <div class="create-company">
    <h2>Crear Empresa</h2>
    <div class="content">
      <div class="first-column">
        <div class="form-field">
          <CoreInput
            id="company-name-id"
            name="text"
            min-length="2"
            label="Nombre de la Empresa"
            placeholder="Nombre de la Empresa"
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
            placeholder="Seleccione una opción"
            @select="(data) => handleOnInput('company_document_type', data)"
          />
          <span v-if="!form.company_document_type" class="error-message">{{
            companyDocumentTypeError
          }}</span>
        </div>
        <div class="form-field">
          <CoreInput
            id="sector-id"
            name="text"
            min-length="2"
            label="Numero de Documento"
            placeholder=""
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
            placeholder="Seleccione una ciudad"
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
            placeholder="Nombre del Sector"
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
            placeholder="Seleccione un rango"
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
            placeholder="Nombre de Usuario de la Empresa"
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
            placeholder="Email de Usuario de la Empresa"
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
        <div class="button">
          <CoreButton
            size="sm"
            label="Crear Empresa"
            :disabled="disableButton"
            @click="onCreateCompany"
          />
        </div>
      </div>
      <div class="second-column upload-logo">
        <div class="image-upload-container">
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            @change="previewImage"
          />
          <label for="imageUpload" class="image-upload-label">
            <div id="imagePreview" class="image-preview">
              <img v-if="imageSrc" :src="imageSrc" alt="Logo Preview" />
              <span v-else>Upload Logo</span>
            </div>
          </label>
          <span
            v-if="form.company_logo"
            class="delete-image"
            @click="deleteImgSelection"
          >
            Borrar selección
          </span>
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
import { getCreateCompanyPayload, isValidEmail } from "~/utils/helpers/common";

interface ICreateCompanyForm {
  company_name: string;
  sector: string;
  user_company_name: string;
  user_company_email: string;
  document_number: string;
  city: string;
  user_company_phone: string;
  company_document_type: string;
  employees: string;
  company_logo?: File | null;
}
const form = ref<ICreateCompanyForm>({
  company_name: "",
  sector: "",
  user_company_name: "",
  user_company_email: "",
  company_document_type: "",
  document_number: "",
  city: "",
  user_company_phone: "",
  company_logo: null,
  employees: "",
});

const companyNameError = ref<string>("");
const sectorError = ref<string>("");
const userCompanyNameError = ref<string>("");
const userCompanyEmailError = ref<string>("");
const companyDocumentTypeError = ref<string>("");
const documentNumberError = ref<string>("");
const cityError = ref<string>("");
const employeesError = ref<string>("");
const userCompanyPhoneError = ref<string>("");
const disableButton = ref<boolean>(true);
const imageSrc = ref<string | null>(null);
const helperStore = useHelperStore();
const userStore = useUserStore();
const { $toast } = useNuxtApp();
const token = userStore.getToken();

const deleteImgSelection = () => {
  form.value.company_logo = null;
  imageSrc.value = null;
};

const previewImage = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      imageSrc.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    form.value.company_logo = file;
  }
};

const onCreateCompany = async () => {
  const {myData, error: myDataError} = await fetchUserData()
  if(!myDataError){
    const formData = new FormData();
    const payload = getCreateCompanyPayload(form.value, myData.id);
    formData.append("company_in", JSON.stringify(payload));
    if (form.value.company_logo) {
      formData.append("picture", form.value.company_logo);
    }
    const params: fetchWrapperProps = {
      method: EFetchMethods.POST,
      path: "company/",
      body: formData,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  
    const { data, error } = await useFetchWrapper(params);
    if (error.value) {
      helperStore.renderToastMessage($toast, true, {
        error: "something went wrong creating company",
      });
    } else {
      const response = data.value;
      helperStore.renderToastMessage($toast, false, {
        success: "Creando Empresa...",
      });
      setTimeout(() => {
        navigateTo("/admin/companies");
      }, 1500);
      console.log(response);
    }
  }
};

const fetchUserData = async () => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `users/me`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing User data",
    });
    return { myData: null, error: true };
  } else {
    return { myData: data.value, error: null };
  }
};
const handleOnInput = (keyField: string, value: string): void => {
  form.value = {
    ...form.value,
    [keyField]: value,
  };
  validateErrorsForm(keyField, value);
  validateForm();
};

const validateErrorsForm = (keyField: string, value: string): void => {
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
  const isCityValid =
    form.value.city.trim().length > 0 && cityError.value === "";
  const isEmployeesValid =
    form.value.employees.trim().length > 0 && employeesError.value === "";
  const isCompanyDocumentTypeValid =
    form.value.company_document_type.trim().length > 0 &&
    companyDocumentTypeError.value === "";

  disableButton.value = !(
    isCompanyNameValid &&
    isSectorValid &&
    isUserCompanyNameValid &&
    isValidEmail(form.value.user_company_email) &&
    isCompanyDocumentTypeValid &&
    isDocumentNumberValid &&
    isCityValid &&
    isEmployeesValid &&
    isUserCompanyPhoneValid
  );
};
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
    .second-column {
      width: 40%;
    }

    .first-column,
    .second-column {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .second-column {
      .image-upload-container {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 250px;
        height: 250px;
        margin: 0 auto;
      }

      .delete-image {
        margin-top: 1rem;
        cursor: pointer;
        color: var(--color-brand);
      }

      .delete-image:hover {
        text-decoration: underline;
      }

      #imageUpload {
        display: none;
      }

      .image-upload-label {
        cursor: pointer;
      }

      .image-preview {
        width: 250px;
        height: 250px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        border: 6px dashed #d1d5dc;
        transition: border-color 0.3s;
        position: relative;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          border-radius: 50%;
        }

        span {
          color: #999;
          font-size: 2rem;
          transition: color 0.3s;
        }

        &:hover {
          border-color: var(--color-brand);

          span {
            color: var(--color-brand);
          }
        }
      }
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
