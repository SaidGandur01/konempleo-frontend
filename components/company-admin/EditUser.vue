<template>
  <div class="create-user">
    <h2>Editar Usuario</h2>
    <div class="content">
      <div class="form-field">
        <CoreInput
          id="user-name-id"
          name="text"
          min-length="2"
          label="Nombre"
          :placeholder="
            currentUser && currentUser.fullname
              ? currentUser.fullname
              : 'Nombre del usuario'
          "
          required
          type="text"
          @input="(data) => handleOnInput('fullname', data)"
        />
        <span v-if="form.fullname.length < 3" class="error-message">{{
          nameError
        }}</span>
      </div>
      <div class="form-field">
        <CoreInput
          id="user-phone-id"
          name="number"
          min-length="2"
          label="Telefono del Usuario"
          :placeholder="
            currentUser && currentUser.phone
              ? currentUser.phone
              : 'Ingresa un numero válido'
          "
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
          label="Editar Usuario"
          :disabled="disableButton"
          @click="onUpdateUser"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useHelperStore } from "~/store/helper.store";
import { useUserStore } from "~/store/user.store";
import { getPUTUserPayload } from "~/utils/helpers/common";
import type { ICompanyAdminUsersListTableRow } from "~/utils/interfaces";

interface IEditUserForm {
  fullname: string;
  phone: string;
}
interface IEditUserProps {
  userId: string;
}
const props = withDefaults(defineProps<IEditUserProps>(), {
  userId: "",
});
const form = ref<IEditUserForm>({
  fullname: "",
  phone: "",
});

const nameError = ref<string>("");
const phoneError = ref<string>("");
const disableButton = ref<boolean>(true);
const currentUser = ref<ICompanyAdminUsersListTableRow>();
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
  switch (keyField) {
    case "fullname":
      nameError.value = value.length < 3 ? "Inserta un nombre válido" : "";
      break;
    case "phone":
      phoneError.value =
        value.length < 3 ? "Inserta un numero telefonico válido" : "";
      break;
    default:
      break;
  }
};

const validateForm = (): void => {
  const isNameValid = form.value.fullname.length >= 3 && nameError.value === "";
  const isPhoneValid = form.value.phone.length >= 3 && phoneError.value === "";

  disableButton.value = !(isNameValid && isPhoneValid);
};

const fetchUserData = async (userId: number) => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `users/${userId}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing Users data",
    });
    currentUser.value = undefined;
  } else {
    currentUser.value = data.value;
  }
};

const onUpdateUser = async () => {
  const user = {
    ...currentUser.value,
    fullname: form.value.fullname,
    phone: form.value.phone,
  };
  const params: fetchWrapperProps = {
    method: EFetchMethods.PUT,
    path: `user/admin/${props.userId}`,
    body: JSON.stringify(
      getPUTUserPayload({
        user,
      })
    ),
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "Something went wrong updating User",
    });
  } else {
    helperStore.renderToastMessage($toast, false, {
      success: "Usuario actualizado correctamente",
    });
    setTimeout(() => {
      navigateTo("/company-admin/users");
    }, 1500);
    console.log(data);
  }
};

watch(
  () => props.userId,
  (newUserId: string) => {
    if (newUserId) {
      fetchUserData(Number(newUserId));
    }
  }
);
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
