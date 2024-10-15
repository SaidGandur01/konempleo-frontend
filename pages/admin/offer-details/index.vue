<template>
  <NuxtLayout name="admin">
    <h2>Ofertas por empresa</h2>
    <div class="form-field">
      <CoreDropdown
        :list-options="companiesListData"
        label="Seleccione una empresa"
        :placeholder="
          offerIdFromUrl ? `Company ${offerIdFromUrl}` : 'Seleccione una opción'
        "
        @select="(data) => handleOnInput('company_name', data)"
      />
      <span v-if="form.company_name.length < 1" class="error-message">{{
        companyNameError
      }}</span>
    </div>
    <AdminResultsCompanyOffersTable :company-name="currentSelection" />
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { companiesListData } from "~/data/companies/companies-list";

interface ICompanyForm {
  company_name: string;
}
const form = ref<ICompanyForm>({
  company_name: "",
});
const companyNameError = ref<string>("");
const currentSelection = ref<string>("");
const offerIdFromUrl = ref<string>("");
const handleOnInput = (keyField: string, value: string): void => {
  form.value = {
    ...form.value,
    [keyField]: value,
  };
  offerIdFromUrl.value = "";
  currentSelection.value = value;
  validateErrorsForm(keyField, value);
};
const validateErrorsForm = (keyField: string, value: string): void => {
  switch (keyField) {
    case "company_name":
      companyNameError.value = !value.length ? "Selecciona un opción" : "";
      break;
    default:
      break;
  }
};

onMounted(() => {
  const route = useRoute();
  const offerId = route.params.id || null;
  if (offerId) {
    offerIdFromUrl.value = offerId[0];
    currentSelection.value = companiesListData[0].value;
  }
});
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.7rem;
}
</style>
