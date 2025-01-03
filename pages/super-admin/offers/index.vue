<template>
  <NuxtLayout name="super-admin">
    <h2>Lista de ofertas</h2>
    <div class="form-field">
      <CoreDropdown
        :list-options="companiesResult"
        label="Seleccione una Compañia"
        :placeholder="
          companyFromUrl ? `${companyFromUrl}` : 'Seleccione una opción'
        "
        :should-emit-id="true"
        @select="(data) => handleOnInput('company', data)"
      />
      <span v-if="form.company.length < 1" class="error-message">{{
        companyError
      }}</span>
    </div>
    <div v-if="companyId" class="form-field">
      <CoreDropdown
        :list-options="offersResult"
        label="Seleccione una oferta"
        :placeholder="
          offerFromUrl ? `${offerFromUrl}` : 'Seleccione una opción'
        "
        :should-emit-id="true"
        @select="(data) => handleOnInput('offer', data)"
      />
      <span v-if="form.offer.length < 1" class="error-message">{{
        offerError
      }}</span>
    </div>
    <SuperResultsOfferDetailsTable :offer-id="currentOfferId" />
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";

definePageMeta({
  middleware: ["protected", "user-guard"],
  path: "/super-admin/offers/:id?",
});

interface ICompanyForm {
  offer: string;
  company: string;
}
const form = ref<ICompanyForm>({
  offer: "",
  company: "",
});
const { $toast } = useNuxtApp();
const userStore = useUserStore();
const helperStore = useHelperStore();
const token = userStore.getToken();
const offerError = ref<string>("");
const companyError = ref<string>("");
const currentCompanySelection = ref<string>("");
const offerFromUrl = ref<string>("");
const companyFromUrl = ref<string>("");
const companyId = ref<string>("");
const companiesResult = ref([]);
const offersResult = ref([]);
const currentOfferId = ref<string>("");

const handleOnInput = (keyField: string, value: string): void => {
  form.value = {
    ...form.value,
    [keyField]: value,
  };
  companyFromUrl.value = "";
  offerFromUrl.value = "";
  if (keyField === "company") companyId.value = value;
  if (keyField === "offer") currentOfferId.value = value;
  validateErrorsForm(keyField, value);
};

const validateErrorsForm = (keyField: string, value: string): void => {
  switch (keyField) {
    case "offer":
      offerError.value = !value.length ? "Selecciona un opción" : "";
      break;
    case "company":
      companyError.value = !value.length ? "Selecciona un opción" : "";
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
    const mappedResponse = data.value.reduce((acc, item) => {
      acc.push({ key: item.id, value: item.name });
      return acc;
    }, []);
    companiesResult.value = mappedResponse;
  }

  const route = useRoute();
  const offerId = route.params.id || null;
  const companyIdFromQuery = route.query.companyId as string;
  if (offerId) {
    currentOfferId.value = offerId as string;
  }
  if (companyIdFromQuery) {
    const [filteredCompany] = companiesResult.value.filter((item) => {
      if (item.key === Number(companyIdFromQuery)) return item;
    });
    companyId.value = companyIdFromQuery;
    currentCompanySelection.value = filteredCompany.key;
    companyFromUrl.value = filteredCompany.value;
  }
});

const fetchCompanyOffers = async (companyId: number) => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `offers/company/details/${companyId}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing Offer",
    });
    offersResult.value = [];
  } else {
    const mappedOffers = data.value.reduce((acc, item) => {
      acc.push({ key: item.id, value: item.name });
      return acc;
    }, []);
    offersResult.value = mappedOffers;
    const [filteredOffer] = mappedOffers.filter((item) => {
      if (item.key === Number(currentOfferId.value)) return item;
    });
    if(filteredOffer) offerFromUrl.value = filteredOffer.value;
  }
};

watch(companyId, async (newCompanyId) => {
  if (newCompanyId) {
    await fetchCompanyOffers(Number(newCompanyId));
  }
});
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.7rem;
}
</style>
