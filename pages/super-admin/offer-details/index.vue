<template>
  <NuxtLayout name="super-admin">
    <h2>Ofertas por empresa</h2>
    <div class="form-field">
      <CoreDropdown
        :list-options="companiesResult"
        label="Seleccione una empresa"
        :should-emit-id="true"
        :placeholder="
          companyFromUrl ? `${companyFromUrl}` : 'Seleccione una opción'
        "
        @select="(data) => handleOnInput('company_name', data)"
      />
      <span v-if="form.company_name.length < 1" class="error-message">{{
        companyNameError
      }}</span>
    </div>
    <SuperResultsCompanyOffersTable :company-id="currentSelection" />
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";

definePageMeta({
  middleware: ["protected", "user-guard"],
  path: "/super-admin/offer-details/:id?",
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
const companyNameError = ref<string>("");
const currentSelection = ref<string>("");
const companyFromUrl = ref<string>("");
const companiesResult = ref([]);

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
    // save data in local store for searching purposes
    const mappedResponse = data.value.reduce((acc, item) => {
      acc.push({ key: item.id, value: item.name });
      return acc;
    }, []);
    companiesResult.value = mappedResponse;
  }
  const route = useRoute();
  const companyId = (route.params.id as string) || null;
  if (companyId) {
    const filteredCompany = companiesResult.value.filter((item) => {
      if (item.key === Number(companyId)) return item;
    });
    currentSelection.value = filteredCompany[0].key;
    companyFromUrl.value = filteredCompany[0].value;
  }
});

</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.7rem;
}
</style>
