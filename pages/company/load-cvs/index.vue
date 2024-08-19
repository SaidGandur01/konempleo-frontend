<template>
  <div class="company-content">
    <div class="slide-wrapper">
      <CompanySlidePanel />
    </div>
    <div class="load-cvs-container">
      <div class="logo-wrapper">
        <img :src="logo" alt="logo" />
      </div>
      <div class="content">
        <h2>Crear Proceso</h2>
        <div class="form-field">
          <CoreDropdown
            :list-options="processListData"
            label="Nombres del proceso"
            placeholder="Seleccione una opción"
            @select="(data) => handleOnInput('process_name', data)"
          />
          <span v-if="form.process_name.length < 1" class="error-message">{{
            processNameError
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
import { processListData } from "~/data/process/process";
import logo from "~/public/images/logo.png";

definePageMeta({
  middleware: ["protected", "company-guard"],
});

interface ICreateProcessForm {
  process_name: string;
}
const form = ref<ICreateProcessForm>({
  process_name: "",
});
const processNameError = ref<string>("");
const disabledButton = ref<boolean>(true);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    case "process_name":
      processNameError.value = !value.length ? "Selecciona un opción" : "";
      break;
    default:
      break;
  }
};
const validateForm = (): void => {
  const isProcessNameValid =
    form.value.process_name && processNameError.value === "";
  const isFilesEmpty = files.value.length;

  disabledButton.value = !(isProcessNameValid && isFilesEmpty);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onHandleFiles = (inputFiles: any): void => {
  console.log("fileS: ", inputFiles);
  files.value = inputFiles;
  validateForm()
};
function sendFiles() {
  // if (pond.value) {
  //   pond.value.processFiles();  // This will trigger the file upload process
  // }
}
</script>
<style lang="scss" scoped>
.company-content {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 20%;
  }
  .load-cvs-container {
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

      h2 {
        font-size: 1.7rem;
      }
    }
  }
}
</style>
