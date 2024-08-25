<template>
  <div class="super-admin-content">
    <div class="slide-wrapper">
      <SuperSlidePanel />
    </div>
    <div class="create-company-container">
      <div class="content">
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
        <CoreResultsSuperCompanyOffersTable :company-name="currentSelection" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { companiesListData } from "~/data/companies/companies-list";

definePageMeta({
  middleware: ["protected", "super-admin"],
  path: "/super-admin/offer-details/:id?",
});
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
  offerIdFromUrl.value = ''
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
.super-admin-content {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 15%;
  }
  .create-company-container {
    align-items: center;
    background-color: var(--background-color-primary);
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 2rem;
    height: 100vh;
    justify-content: flex-start;
    overflow-y: scroll;
    padding: 7rem 5rem;

    .content {
      display: flex;
      flex-direction: column;
      border: 1px solid #d1d5dc;
      gap: 3rem;
      width: 100%;
      padding: 2rem;
      border-radius: 1rem;
      background-color: var(--background-color-secondary);

      h2 {
        font-size: 1.7rem;
      }
    }
  }
}
</style>
