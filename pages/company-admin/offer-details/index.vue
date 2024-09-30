<template>
  <div class="company-content">
    <div class="slide-wrapper">
      <CompanyAdminSlidePanel />
    </div>
    <div class="offer-details-container">
      <div class="content">
        <h2>Detalles de oferta</h2>
        <div class="form-field">
          <CoreDropdown
            :list-options="offerListData"
            label="Nombre de la oferta"
            :placeholder="
              offerIdFromUrl ? `Offer ${offerIdFromUrl}` : 'Seleccione una opción'
            "
            @select="(data) => handleOnInput('offer_name', data)"
          />
          <span v-if="form.offer_name.length < 1" class="error-message">{{
            offerNameError
          }}</span>
        </div>
        <CoreResultsCompanyAdminOfferDetailsTable :offer-name="currentSelection" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { offerListData } from "~/data/offer/offer";

definePageMeta({
  middleware: ["protected", "company-admin-guard"],
  path: "/company-admin/offer-details/:id?",
});

interface ICreateOfferForm {
  offer_name: string;
}
const form = ref<ICreateOfferForm>({
  offer_name: "",
});
const offerIdFromUrl = ref<string>("");
const offerNameError = ref<string>("");
const currentSelection = ref<string>("");
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
.company-content {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 20%;
  }
  .offer-details-container {
    align-items: center;
    background-color: var(--background-color-primary);
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 2rem;
    height: 100vh;
    justify-content: flex-start;
    overflow-y: scroll;
    padding: 7rem;

    .content {
      display: flex;
      flex-direction: column;
      border: 1px solid #D1D5DC;
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
