<template>
  <NuxtLayout name="admin">
    <h2>Ofertas por empresa</h2>
    <div class="form-field">
      <CoreDropdown
        :list-options="companiesResult"
        label="Seleccione una empresa"
        :placeholder="
          companyFromUrl ? `${companyFromUrl}` : 'Seleccione una opción'
        "
        :should-emit-id="true"
        @select="(data) => handleOnInput('company_name', data)"
      />
      <span v-if="form.company_name.length < 1" class="error-message">{{
        companyNameError
      }}</span>
    </div>
    <AdminResultsCompanyOffersTable :company-id="currentSelection" />
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";

definePageMeta({
  middleware: ["protected", "user-guard"],
  path: "/admin/offer-details/:id?",
});

interface ICompanyForm {
  company_name: string;
}

const { $toast } = useNuxtApp();
const userStore = useUserStore();
const helperStore = useHelperStore();
const token = userStore.getToken();
const form = ref<ICompanyForm>({
  company_name: "",
});
const companiesResult = ref([]);
const companyNameError = ref<string>("");
const currentSelection = ref<string>("");
const companyFromUrl = ref<string>("");

onMounted(async () => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: "company/owned/",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing Companies owned data",
    });
    companiesResult.value = [];
  } else {
    const mappedResponse = data.value.reduce((acc, item) => {
      acc.push({ key: item.id, value: item.name });
      return acc;
    }, []);
    companiesResult.value = mappedResponse;
  }
  const route = useRoute();
  const offerId = route.params.id || null;
  if (offerId) {
    // this isnt working verify why

    const filteredCompany = companiesResult.value.filter((item) => {
      if (item.key === Number(offerId)) return item;
    });
    currentSelection.value = filteredCompany[0].key; // we are having dups companies waiting for fix on backend
    companyFromUrl.value = filteredCompany[0].value;
  }
});

const handleOnInput = (keyField: string, value: string): void => {
  form.value = {
    ...form.value,
    [keyField]: value,
  };
  companyFromUrl.value = "";
  currentSelection.value = value;
  validateErrorsForm(keyField, value);
};
const validateErrorsForm = (keyField: string, value: string): void => {
  switch (keyField) {
    case "company_name":
      companyNameError.value = !value.length ? "Selecciona un opción" : "";
      break;
    default:
      break;
  }
};
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.7rem;
}
</style>
