<template>
  <NuxtLayout name="company-admin">
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
h2 {
  font-size: 1.7rem;
}
</style>
