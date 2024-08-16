<template>
  <div class="login-page">
    <div class="logo">
      <img :src="logo" alt="logo" >
    </div>
    <div class="form-section">
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
      <div class="button">
        <CoreButton
          size="sm"
          label="Login"
          :disabled="false"
          @click="handleOnLogin"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";
import logo from "~/public/images/logo.png";
import { EUser } from "~/utils/enum";

interface ILoginForm {
  email: string;
  password: string;
}

const form = ref<ILoginForm>({
  email: "saidtestone@testone.com",
  password: "123",
});
const emailError = ref<string>("");
const passwordError = ref<string>("");
const disableButton = ref<boolean>(true);
// const isLoading = ref<boolean>(false);
const userStore = useUserStore();

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
      // eslint-disable-next-line no-useless-escape
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

const validateForm = (): void => {
  disableButton.value =
    form.value.password === "" ||
    form.value.password.length < 3 ||
    // eslint-disable-next-line no-useless-escape
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
    form: form.value,
    formData: formData.toString(),
  });

  // const currentUserRole = EUser.ADMIN;
  // isLoading.value = true
  // setTimeout(() => {
  //   isLoading.value = false
    // userStore.setUserRole(EUser.COMPANY)
  //   if (currentUserRole === EUser.COMPANY) {
  //     navigateTo('/home/position')
  //   } else {
  //   }
  // }, 2500);
  navigateTo('/home')
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
  color: var(--color-text-900);

  .logo {
    text-align: center;

    img {
      width: 50%;
      margin: 0 auto;
    }
  }

  .form-section {
    display: flex;
    flex-direction: column;
    gap: 4rem;
    width: 50%;
    padding: 4rem;
    border: 1px solid #6e718b;
    border-radius: 1rem;

    .form-field {
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
