<template>
  <div class="company-admin-content">
    <div class="slide-wrapper">
      <CompanyAdminSlidePanel />
    </div>
    <div class="load-cvs-container">
      <!-- <div class="logo-wrapper">
        <img :src="logo" alt="logo" />
      </div> -->
      <div class="content">
        <h2>Cargar hojas de vida</h2>
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
        <CoreUploadFile @emitfile="onHandleFiles" />
        <div class="button">
          <CoreButton
            size="sm"
            label="Guardar"
            :disabled="disabledButton"
            @click="sendFiles"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { offerListData } from "~/data/offer/offer";
// import logo from "~/public/images/logo.png";

definePageMeta({
  middleware: ["protected", "company-admin-guard"],
});

interface ICreateOfferForm {
  offer_name: string;
}
const form = ref<ICreateOfferForm>({
  offer_name: "",
});
const offerNameError = ref<string>("");
const disabledButton = ref<boolean>(true);
const files = ref<any>([]);

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
    case "offer_name":
      offerNameError.value = !value.length ? "Selecciona un opción" : "";
      break;
    default:
      break;
  }
};
const validateForm = (): void => {
  const isOfferNameValid = form.value.offer_name && offerNameError.value === "";
  const isFilesEmpty = files.value.length;

  disabledButton.value = !(isOfferNameValid && isFilesEmpty);
};
const onHandleFiles = (inputFiles: any): void => {
  console.log("fileS: ", inputFiles);
  files.value = inputFiles;
  validateForm();
};
function sendFiles() {
  // if (pond.value) {
  //   pond.value.processFiles();  // This will trigger the file upload process
  // }
}
</script>
<style lang="scss" scoped>
.company-admin-content {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 20%;
  }
  .load-cvs-container {
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

    .logo-wrapper {
      text-align: center;

      img {
        width: 50%;
      }
    }

    .content {
      background-color: var(--background-color-secondary);
      border-radius: 1rem;
      border: 1px solid #D1D5DC;
      display: flex;
      flex-direction: column;
      gap: 3rem;
      padding: 2rem;
      width: 100%;

      h2 {
        font-size: 1.7rem;
      }
    }
  }
}
</style>
