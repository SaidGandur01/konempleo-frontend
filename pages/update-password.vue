<template>
  <div class="login-page">
    <div class="logo">
      <img :src="kLogo" alt="logo" />
    </div>
    <div class="form-section box-shadow-2xl">
      <h2>Cambiar contraseña</h2>
      <div class="form-field">
        <CoreInput
          id="email"
          name="email"
          min-length="2"
          label="Email"
          placeholder="Please enter your email"
          required
          type="email"
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
          id="current_password"
          name="current_password"
          min-length="2"
          label="Current Password"
          placeholder="Your Password"
          required
          type="password"
          @input="(data) => handleOnInput('current_password', data)"
        />
        <span v-if="form.current_password.length < 3" class="error-message">{{
          currentPasswordError
        }}</span>
      </div>
      <div class="form-field">
        <CoreInput
          id="new_password"
          name="new_password"
          min-length="2"
          label="New Password"
          placeholder="New password"
          required
          type="password"
          @input="(data) => handleOnInput('new_password', data)"
        />
        <span v-if="form.new_password.length < 3" class="error-message">{{
          newPasswordError
        }}</span>
      </div>
      <div class="button">
        <CoreButton
          size="sm"
          label="Update Password"
          :disabled="disableButton"
          @click="handleOnUpdate"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import kLogo from "~/public/images/ke_logo_dark.png";
import { useHelperStore } from "~/store/helper.store";
import { isValidEmail } from "~/utils/helpers/common";
const { $toast } = useNuxtApp();

interface ILoginForm {
  email: string;
  current_password: string;
  new_password: string;
}

const form = ref<ILoginForm>({
  email: "",
  current_password: "",
  new_password: "",
});

const emailError = ref<string>("");
const currentPasswordError = ref<string>("");
const newPasswordError = ref<string>("");
const disableButton = ref<boolean>(true);
const helperStore = useHelperStore();

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
    case "email":
      if (!isValidEmail(value)) {
        emailError.value = "Enter a valid email";
      }
      break;
    case "current_password":
      if (value.length < 3) {
        currentPasswordError.value = "Minimun lenght of 3";
      }
      break;
    case "new_password":
      if (value.length < 3) {
        newPasswordError.value = "Minimun lenght of 3";
      }
      break;
    default:
      break;
  }
};

const validateForm = (): void => {
  const isCurrentPasswordInvalid =
    form.value.current_password.length < 3 && currentPasswordError.value !== "";
  const isNewPasswordInvalid =
    form.value.new_password.length < 3 && newPasswordError.value !== "";

  disableButton.value =
    isCurrentPasswordInvalid ||
    isNewPasswordInvalid ||
    !isValidEmail(form.value.email);
};

const handleOnUpdate = async (): Promise<void> => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.POST,
    path: "change-password",
    body: form.value,
    headers: {
      accept: "application/json",
    },
  };

  const { data: response, error } = await useFetchWrapper(params);

  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "Invalid Credentials, Please try again",
    });
  } else {
    helperStore.renderToastMessage($toast, false, {
      success: "Updated password successfully, please Login",
    });
    setTimeout(() => {
      navigateTo("/login");
    }, 2000);
    console.log(response);
  }
};
</script>
<style lang="scss" scoped>
.login-page {
  background-color: var(--background-color-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 0 0 0;
  min-height: 100vh;
  color: var(--color-text-200);

  .logo {
    text-align: center;

    img {
      width: 15%;
      margin: 5% auto;
    }
  }

  .form-section {
    display: flex;
    flex-direction: column;
    gap: 4rem;
    width: 50%;
    padding: 4rem;
    border-radius: 1rem;
    background-color: var(--background-color-secondary);

    .form-field {
      .terms-and-conditions {
        display: flex;
        align-items: center;

        input {
          margin-right: 1rem;
        }

        a {
          cursor: pointer;
          color: var(--color-brand-info-525);
          text-decoration: underline;
        }
      }
      .error-message {
        display: block;
        color: var(--color-brand-danger-600);
        margin: 1rem 0;
        font-size: 1.2rem;
        font-weight: 500;
        letter-spacing: 1px;
      }
    }
  }
}

@media (max-width: 768px) {
  .login-page {
    .logo {
      img {
        width: 85%;
      }
    }
    .form-section {
      margin-top: 5rem;
      padding: 2rem;
      gap: 2rem;
      width: 85%;

      .button-container {
        width: 100%;
        margin: 1rem 0;
      }
    }
  }
}
</style>
