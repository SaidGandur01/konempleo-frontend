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
          :list-options="companiesResult"
          label="Empresas asignadas"
          placeholder="Seleccione una opción"
          :multiple-select="true"
          :should-emit-id="true"
          :required="false"
          @select="(data) => handleOnInput('companies', data)"
        />
        <span v-if="form.companies.length < 1" class="error-message">{{
          companiesError
        }}</span>
      </div>
      <div class="form-field">
        <CoreDropdown
          :list-options="rolListData"
          label="Role"
          placeholder="Seleccione una opción"
          :should-emit-id="true"
          @select="(data) => handleOnInput('role', data)"
        />
        <span v-if="!form.role" class="error-message">{{ rolError }}</span>
      </div>
      <div class="form-field">
        <CoreInput
          id="user-phone-id"
          name="number"
          min-length="2"
          label="Telefono del Usuario"
          placeholder="Ingresa un numero válido"
          required
          type="number"
          @input="(data) => handleOnInput('phone', data)"
        />
        <span v-if="form.phone.length < 3" class="error-message">{{
          phoneError
        }}</span>
      </div>
      <div class="button">
        <CoreButton
          size="sm"
          label="Crear Usuario"
          :disabled="disableButton"
          @click="onCreateUser"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { rolListData } from "~/data/rol/rol";
import { useHelperStore } from "~/store/helper.store";
import { useUserStore } from "~/store/user.store";
import { getCreateUserPayload, isValidEmail } from "~/utils/helpers/common";

interface ICreateUserForm {
  name: string;
  email: string;
  companies: string;
  role: string;
  phone: string;
}
const form = ref<ICreateUserForm>({
  name: "",
  email: "",
  companies: "",
  role: "",
  phone: "",
});

const nameError = ref<string>("");
const emailError = ref<string>("");
const phoneError = ref<string>("");
const companiesError = ref<string>("");
const rolError = ref<string>("");
const disableButton = ref<boolean>(true);
const companiesResult = ref([]);
const helperStore = useHelperStore();
const userStore = useUserStore();
const token = userStore.getToken();
const { $toast } = useNuxtApp();

const handleOnInput = (keyField: string, value: string | string[]): void => {
  form.value = {
    ...form.value,
    [keyField]: value,
  };
  validateErrorsForm(keyField, value);
  validateForm();
};

const validateErrorsForm = (
  keyField: string,
  value: string | string[]
): void => {
  if (Array.isArray(value)) {
    // only one sending string[] is companies
    companiesError.value = !value.length ? "Selecciona una opción" : "";
  } else {
    switch (keyField) {
      case "name":
        nameError.value = value.length < 3 ? "Inserta un nombre válido" : "";
        break;
      case "email":
        if (!isValidEmail(value)) {
          emailError.value = "Ingresa un email válido";
        } else {
          emailError.value = "";
        }
        break;
      case "companies":
        companiesError.value = !value.length ? "Selecciona una opción" : "";
        break;
      case "role":
        rolError.value = !value.length ? "Selecciona una opción" : "";
        break;
      case "phone":
        phoneError.value =
          value.length < 3 ? "Inserta un numero telefonico válido" : "";
        break;
      default:
        break;
    }
  }
};

const validateForm = (): void => {
  const isNameValid = form.value.name.length >= 3 && nameError.value === "";
  const isRolValid = form.value.role && rolError.value === "";
  const isPhoneValid = form.value.phone.length >= 3 && phoneError.value === "";

  disableButton.value = !(
    isNameValid &&
    isValidEmail(form.value.email) &&
    isPhoneValid &&
    isRolValid
  );
};

const onCreateUser = async () => {
  const payload = getCreateUserPayload(form.value);
  const userStore = useUserStore();
  const token = userStore.getToken();
  const params: fetchWrapperProps = {
    method: EFetchMethods.POST,
    path: "user/admin/",
    body: payload,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong creating User",
    });
  } else {
    const response = data.value;
    helperStore.renderToastMessage($toast, false, {
      success: "Usuario creado exitosamente",
    });
    setTimeout(() => {
      navigateTo("/super-admin/users");
    }, 1500);
    console.log(response);
  }
};

onMounted(async () => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: "company/all/",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing Companies data",
    });
    companiesResult.value = [];
  } else {
    const mappedCompanies = data.value.reduce((acc, item) => {
      acc.push({ key: item.id, value: item.name });
      return acc;
    }, []);
    companiesResult.value = mappedCompanies;
  }
});
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

  .error-message {
    display: block;
    color: var(--color-brand-danger-600);
    margin: 1rem 0;
    font-size: 1.2rem;
    font-weight: 500;
    letter-spacing: 1px;
  }

  .form-group {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 3rem;
  }
}
</style>
