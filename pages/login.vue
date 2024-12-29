<template>
  <div class="login-page">
    <div class="logo">
      <img :src="kLogo" alt="logo" />
    </div>
    <div class="form-section box-shadow-2xl">
      <h2>Inicio de sesión</h2>
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
          id="password"
          name="password"
          min-length="2"
          label="Password"
          placeholder="Your password"
          required
          type="password"
          @input="(data) => handleOnInput('password', data)"
        />
        <span v-if="form.password.length < 3" class="error-message">{{
          passwordError
        }}</span>
      </div>
      <div class="form-field">
        <label class="terms-and-conditions">
          <input
            v-model="acceptTerms"
            type="checkbox"
            @click="onHandleTermsAndConditions"
          />
          <a
            href="https://konempleo.com/legales"
            target="_blank"
            rel="noopener noreferrer"
          >
            Acepto términos y condiciones
          </a>
        </label>
      </div>
      <div class="button">
        <CoreButton
          size="sm"
          label="Login"
          :disabled="disableButton"
          @click="handleOnLogin"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";
import kLogo from "~/public/images/ke_logo_dark.png";
import { useHelperStore } from "~/store/helper.store";
import { isValidEmail } from "~/utils/helpers/common";
const { $toast } = useNuxtApp();

interface ILoginForm {
  email: string;
  password: string;
}

const form = ref<ILoginForm>({
  email: "",
  password: "",
});
const emailError = ref<string>("");
const passwordError = ref<string>("");
const disableButton = ref<boolean>(true);
const acceptTerms = ref(true);
// const isLoading = ref<boolean>(false);
const userStore = useUserStore();
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
    case "password":
      if (value.length < 3) {
        passwordError.value = "Minimun lenght of 3";
      }
      break;
    default:
      break;
  }
};

const onHandleTermsAndConditions = (): void => {
  acceptTerms.value = !acceptTerms.value;
  validateForm();
};

const validateForm = (): void => {
  disableButton.value =
    form.value.password === "" ||
    form.value.password.length < 3 ||
    !acceptTerms.value ||
    !isValidEmail(form.value.email);
};

const handleOnLogin = async (): Promise<void> => {
  const payload: { username: string; password: string } = {
    username: form.value.email,
    password: form.value.password,
  };
  const formData = new URLSearchParams();

  for (const [key, value] of Object.entries(payload)) {
    formData.append(key, value as string);
  }

  const params: fetchWrapperProps = {
    method: EFetchMethods.POST,
    path: "login",
    body: formData.toString(),
    headers: {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  const { data: response, error } = await useFetchWrapper(params);

  if (error.value) {
    if (
      error.value.statusCode === 403 &&
      error.value.data.detail ===
        "You must change your password before continuing."
    ) {
      helperStore.renderToastMessage($toast, true, {
        error: "You need to update your password, redirecting...",
      });
      setTimeout(() => {
        navigateTo("/update-password");
      }, 2000);
    } else {
      helperStore.renderToastMessage($toast, true, {
        error: "Invalid Credentials, Please try again",
      });
    }
  } else {
    userStore.setToken(response.value.access_token);
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
