<template>
  <NuxtLayout name="admin">
    <h2>Lista de ofertas</h2>
    <div class="form-field">
      <CoreDropdown
        :list-options="offerListData"
        label="Seleccione una oferta"
        :placeholder="
          offerIdFromUrl ? `Oferta ${offerIdFromUrl}` : 'Seleccione una opción'
        "
        @select="(data) => handleOnInput('offer_name', data)"
      />
      <span v-if="form.offer_name.length < 1" class="error-message">{{
        offerNameError
      }}</span>
    </div>
    <AdminResultsOfferDetailsTable :offer-name="currentSelection" />
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { offerListData } from "~/data/offer/offer";

interface ICompanyForm {
  offer_name: string;
}
const form = ref<ICompanyForm>({
  offer_name: "",
});
const offerNameError = ref<string>("");
const currentSelection = ref<string>("");
const offerIdFromUrl = ref<string>("");
const handleOnInput = (keyField: string, value: string): void => {
  form.value = {
    ...form.value,
    [keyField]: value,
  };
  offerIdFromUrl.value = "";
  currentSelection.value = value;
  console.log({ value: currentSelection.value });
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

onMounted(() => {
  const route = useRoute();
  const offerId = route.params.id || null;
  if (offerId) {
    offerIdFromUrl.value = offerId[0];
    currentSelection.value = offerListData[0].value;
  }
});
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.7rem;
}
</style>
