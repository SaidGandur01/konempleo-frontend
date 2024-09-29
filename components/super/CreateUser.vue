<template>
  <div class="create-user">
    <h2>Crear Usuario</h2>
    <div class="content">
      <div class="form-field">
        <CoreInput
          id="user-name-id"
          name="text"
          min-length="2"
          label="Nombre"
          placeholder="Nombre del usuario"
          required
          type="text"
          @input="(data) => handleOnInput('name', data)"
        />
        <span v-if="form.name.length < 3" class="error-message">{{
          nameError
        }}</span>
      </div>
      <div class="form-field">
        <CoreInput
          id="user-email-id"
          name="text"
          min-length="2"
          label="Correo Electrónico"
          placeholder="Ingresa un email válido"
          required
          type="text"
          @input="(data) => handleOnInput('email', data)"
        />
        <span
          v-if="
            !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.email)
          "
          class="error-message"
          >{{ emailError }}</span
        >
      </div>
      <div class="form-field">
        <CoreDropdown
          :list-options="companiesToAssignUserListData"
          label="Empresas asignadas"
          placeholder="Seleccione una opción"
          @select="(data) => handleOnInput('companies', data)"
        />
        <span v-if="!form.companies" class="error-message">{{
          companiesError
        }}</span>
      </div>
      <div class="form-field">
        <CoreDropdown
          :list-options="rolListData"
          label="Rol"
          placeholder="Seleccione una opción"
          @select="(data) => handleOnInput('rol', data)"
        />
        <span v-if="!form.rol" class="error-message">{{
          rolError
        }}</span>
      </div>
      <div class="button">
        <CoreButton
          size="sm"
          label="Crear Usuario"
          :disabled="false"
          @click="onCreateUser"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { companiesToAssignUserListData } from "~/data/companies/companies-to-assign-user";
import { rolListData } from "~/data/rol/rol";
import { useHelperStore } from "~/store/helper.store";

interface ICreateUserForm {
  name: string;
  email: string;
  companies: string;
  rol: string;
}
const form = ref<ICreateUserForm>({
  name: "",
  email: "",
  companies: "",
  rol: "",
});

const nameError = ref<string>("");
const emailError = ref<string>("");
const companiesError = ref<string>("");
const rolError = ref<string>("");

const disableButton = ref<boolean>(true);
const helperStore = useHelperStore()
const { $toast } = useNuxtApp();

const onCreateUser = (): void => {
  console.log("form: ", form.value);
  helperStore.renderToastMessage(
    $toast,
    false,
    { success: 'Usuario creado exitosamente' }
  );
  setTimeout(() => {
    navigateTo("/super-admin/users");
  }, 1500);
};
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
    case "name":
      nameError.value = value.length < 3 ? "Inserta un nombre válido" : "";
      break;
    case "email":
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        emailError.value = "Ingresa un email válido";
      }
      break;
    case "companies":
      companiesError.value = !value.length ? "Selecciona una opción" : "";
      break;
    case "rol":
      rolError.value = !value.length ? "Selecciona una opción" : "";
      break;
    default:
      break;
  }
};
const validateForm = (): void => {
  const isNameValid = form.value.name.length >= 3 && nameError.value === "";
  const isCompaniesValid = form.value.companies && companiesError.value === "";
  const isRolValid = form.value.rol && rolError.value === "";

  disableButton.value = !(
    isNameValid &&
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.value.email) &&
    isCompaniesValid &&
    isRolValid
  );
};
</script>
<style lang="scss" scoped>
.create-user {
  border-radius: 1rem;
  background-color: var(--background-color-secondary);
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
  width: 100%;

  .content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    width: 70%;
    padding-bottom: 2rem;
  }

  h2 {
    font-size: 1.7rem;
  }

  .form-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 3rem;
  }
}
</style>
