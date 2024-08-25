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
          <CoreDropdown
            :list-options="konEmpleoContactListData"
            label="Persona Responsable en KonEmpleo"
            placeholder="Seleccione una opción"
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
            :value="form.company_offers"
            @input="(data) => handleOnInput('company_offers', data)"
          />
          <span v-if="form.company_offers < 1" class="error-message">{{
            companyOffersError
          }}</span>
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
      <div class="second-column">

      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { konEmpleoContactListData } from "~/data/konempleo-contacts/konempleo-contacts";

interface ICreateCompanyForm {
  company_name: string;
  sector: string;
  user_company_name: string;
  user_company_email: string;
  konempleo_contact: string;
  company_offers: number;
}
const form = ref<ICreateCompanyForm>({
  company_name: "",
  sector: "",
  user_company_name: "",
  user_company_email: "",
  konempleo_contact: "",
  company_offers: 5,
});

const companyNameError = ref<string>("");
const sectorError = ref<string>("");
const userCompanyNameError = ref<string>("");
const userCompanyEmailError = ref<string>("");
const konEmpleoContactError = ref<string>("");
const companyOffersError = ref<string>("");

const disableButton = ref<boolean>(true);
const onCreateCompany = (): void => {
  console.log('form: ', form.value)
}
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
    case "user_company_name":
      userCompanyNameError.value =
        value.length < 3 ? "Inserta un username válido" : "";
      break;
    case "user_company_email":
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        userCompanyEmailError.value = "Ingresa un email válido";
      }
      break;
    case "konempleo_contact":
      konEmpleoContactError.value = !value.length
        ? "Selecciona una opción"
        : "";
      break;
    case "company_offers":
      companyOffersError.value =
        isNaN(Number(value)) || Number(value) < 1
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
  const isUserCompanyNameValid =
    form.value.user_company_name.length >= 3 &&
    userCompanyNameError.value === "";
  const isKonEmpleoContactValid =
    form.value.konempleo_contact && konEmpleoContactError.value === "";
  const isCompanyOffersValid =
    !isNaN(Number(form.value.company_offers)) &&
    Number(form.value.company_offers) >= 1 &&
    companyOffersError.value === "";

  disableButton.value = !(
    isCompanyNameValid &&
    isSectorValid &&
    isUserCompanyNameValid &&
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      form.value.user_company_email
    ) &&
    isKonEmpleoContactValid &&
    isCompanyOffersValid
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

    .first-column,
    .second-column {
      width: 50%;
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .second-column {
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
