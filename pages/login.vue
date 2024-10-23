<template>
  <div class="login-page">
    <div class="logo">
      <img :src="kLogo" alt="logo" >
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
        <CoreDropdown
          :list-options="dataList"
          label="Seleccione un rol"
          :placeholder="currentRole === EUser.COMPANY ? 'company' : ''"
          @select="onHandleRol"
        />
      </div>
      <div class="form-field">
        <label class="terms-and-conditions">
          <input type="checkbox" @click="onHandleTermsAndConditions" >
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
import { EUser } from "~/utils/enum";

interface ILoginForm {
  email: string;
  password: string;
}

const form = ref<ILoginForm>({
  email: "saidtestone@testone.com",
  password: "123",
});
const dataList: Array<{ key: string; value: EUser }> = [
  { key: "super_admin", value: EUser.SUPER_ADMIN },
  { key: "admin", value: EUser.ADMIN },
  { key: "company_admin", value: EUser.ADMIN_COMPANY },
  { key: "company", value: EUser.COMPANY },
];

const emailError = ref<string>("");
const passwordError = ref<string>("");
const disableButton = ref<boolean>(true);
const currentRole = ref<EUser>(EUser.COMPANY);
const acceptTerms = ref(false);
// const isLoading = ref<boolean>(false);
const userStore = useUserStore();
const onHandleRol = (data: string): void => {
  currentRole.value = data as EUser;
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
    case "email":
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
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
  acceptTerms.value = !acceptTerms.value
  validateForm()
}

const validateForm = (): void => {
  disableButton.value =
    form.value.password === "" ||
    form.value.password.length < 3 ||
    !acceptTerms.value ||
    !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(form.value.email);
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

  console.log({
    currentRole: currentRole.value,
  });

  userStore.setUserRole(currentRole.value);
  // const headers = {
  //   accept: "application/json",
  //   "Content-Type": "application/x-www-form-urlencoded",
  // };

  // const { data: response, error } = await useFetchWrapper(
  //   EFetchMethods.POST,
  //   "login",
  //   formData.toString(),
  //   headers,
  // );

  // if (error.value) {
  //   assessmentStore.renderToast($toast, true);
  // } else {
  //   await assessmentStore.setUser(response.value.access_token);
  // }
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
        color: var(--color-text-900);
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
