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
import { getCreateUserPayload, isValidEmail } from "~/utils/helpers/common";
import { useHelperStore } from "~/store/helper.store";
import { useUserStore } from "~/store/user.store";

interface ICreateUserForm {
  name: string;
  email: string;
  phone: string;
}
const form = ref<ICreateUserForm>({
  name: "",
  email: "",
  phone: "",
});
const nameError = ref<string>("");
const emailError = ref<string>("");
const phoneError = ref<string>("");
const disableButton = ref<boolean>(true);
const userStore = useUserStore();
const helperStore = useHelperStore();
const token = userStore.getToken();
const { $toast } = useNuxtApp();

const fetchMyData = async () => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `users/me`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing User data",
    });
    return { myData: null, error: true };
  } else {
    return { myData: data.value, error: null };
  }
};

const onCreateUser = async () => {
  const { myData, error: userDataError } = await fetchMyData();
  if (!userDataError) {
    const payload = getCreateUserPayload(form.value, true);
    const params: fetchWrapperProps = {
      method: EFetchMethods.POST,
      path: `user/?company_id=${myData.companies[0].id}`,
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
      helperStore.renderToastMessage($toast, false, {
        success: "Usuario creado exitosamente",
      });
      setTimeout(() => {
        navigateTo("/company-admin/users");
      }, 1500);
      console.log(data.value);
    }
  }
};

const handleOnInput = (keyfield: string, value: string): void => {
  form.value = {
    ...form.value,
    [keyfield]: value,
  };
  validateErrorsForm(keyfield, value);
  validateForm();
};

const validateErrorsForm = (keyfield: string, value: string): void => {
  switch (keyfield) {
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
    case "phone":
      nameError.value = value.length < 3 ? "Inserta un numero válido" : "";
      break;
    default:
      break;
  }
};

const validateForm = (): void => {
  const isNameValid = form.value.name.length >= 3 && nameError.value === "";
  const isPhoneValid = form.value.phone.length >= 3 && phoneError.value === "";

  disableButton.value = !(
    isNameValid &&
    isValidEmail(form.value.email) &&
    isPhoneValid
  );
};
</script>
<style lang="scss">
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

  .button {
    margin-top: 3rem;
  }
}
</style>
