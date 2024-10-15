<template>
  <NuxtLayout name="company">
    <h2>Detalles de oferta</h2>
    <div class="form-field">
      <CoreDropdown
        :list-options="offerListData"
        label="Nombre de la oferta"
        placeholder="Seleccione una opción"
        @select="(data) => handleOnInput('offer_name', data)"
      />
      <span v-if="form.offer_name.length < 1" class="error-message">{{
        offerNameError
      }}</span>
    </div>
    <CompanyResultsOfferDetailsTable :offer-name="currentSelection" />
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { offerListData } from "~/data/offer/offer";

interface ICreateOfferForm {
  offer_name: string;
}
const form = ref<ICreateOfferForm>({
  offer_name: "",
});
const offerNameError = ref<string>("");
const currentSelection = ref<string>("");
const handleOnInput = (keyField: string, value: string): void => {
  form.value = {
    ...form.value,
    [keyField]: value,
  };
  currentSelection.value = value;
  validateErrorsForm(keyField, value);
};
const validateErrorsForm = (keyField: string, value: string): void => {
  switch (keyField) {
    case "offer_name":
      offerNameError.value = !value.length ? "Selecciona un opción" : "";
      break;
    default:
      break;
  }
};
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.7rem;
}
</style>
