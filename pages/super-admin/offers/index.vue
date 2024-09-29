<template>
  <div class="super-admin-content">
    <div class="slide-wrapper">
      <SuperSlidePanel />
    </div>
    <div class="offers-container">
      <div class="content">
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
        <CoreResultsSuperOfferDetailsTable :offer-name="currentSelection" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { offerListData } from "~/data/offer/offer";

definePageMeta({
  middleware: ["protected", "super-admin"],
  path: "/super-admin/offers/:id?",
});
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
  offerIdFromUrl.value = ''
  currentSelection.value = value;
  console.log({value: currentSelection.value})
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
.super-admin-content {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 15%;
  }
  .offers-container {
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
