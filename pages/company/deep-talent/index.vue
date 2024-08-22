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
            :list-options="processListData"
            label="Nombre del proceso"
            placeholder="Seleccione una opción"
            @select="(data) => handleOnInput('process_name', data)"
          />
          <span v-if="form.process_name.length < 1" class="error-message">{{
            processNameError
          }}</span>
        </div>
        <CoreResultsTable :process-name="currentSelection"/>
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
const currentSelection = ref<string>('');
const handleOnInput = (keyField: string, value: string): void => {
  form.value = {
    ...form.value,
    [keyField]: value,
  };
  currentSelection.value = value
  validateErrorsForm(keyField, value);
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
