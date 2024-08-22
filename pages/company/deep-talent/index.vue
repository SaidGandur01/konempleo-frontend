<template>
  <div class="company-content">
    <div class="slide-wrapper">
      <CompanySlidePanel />
    </div>
    <div class="deep-talent-container">
      <div class="logo-wrapper">
        <img :src="logo" alt="logo" />
      </div>
      <div class="content box-shadow-2xl">
        <h2>Resultados</h2>
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
        <CoreResultsTable :offer-name="currentSelection" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { offerListData } from "~/data/offer/offer";
import logo from "~/public/images/logo.png";

definePageMeta({
  middleware: ["protected", "company-guard"],
});

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
.company-content {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 20%;
  }
  .deep-talent-container {
    flex: 1;
    padding: 5rem 5rem 25rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 2rem;
    background-color: var(--background-color-primary);

    .logo-wrapper {
      text-align: center;

      img {
        width: 50%;
      }
    }

    .content {
      display: flex;
      flex-direction: column;
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
