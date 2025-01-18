<template>
  <NuxtLayout name="company">
    <h2>Detalles de oferta</h2>
    <div class="form-field">
      <CoreDropdown
        :list-options="dropdownOptions"
        label="Nombre de la oferta"
        :placeholder="
          offerIdFromUrl ? `${offerIdFromUrl}` : 'Seleccione una opción'
        "
        :should-emit-id="true"
        @select="(data) => handleOnInput('offer', data)"
      />
      <span v-if="form.offer.length < 1" class="error-message">{{
        offerError
      }}</span>
    </div>
    <CompanyResultsOfferDetailsTable
      :offer-id="offerId"
      :request-offer-data="onDataRequest"
    />
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";
import type { ICompanyOffersListTableRow } from "~/utils/interfaces";

definePageMeta({
  middleware: ["protected", "user-guard"],
  path: "/company/offer-details/:id?",
});

interface ICreateOfferForm {
  offer: string;
}
const form = ref<ICreateOfferForm>({
  offer: "",
});
const offerIdFromUrl = ref<string>("");
const offerError = ref<string>("");
const offerId = ref<string>("");
const { $toast } = useNuxtApp();
const helperStore = useHelperStore();
const userStore = useUserStore();
const token = userStore.getToken();
const dropdownOptions = ref([]);
const offerResults = ref<ICompanyOffersListTableRow[]>([]);

const handleOnInput = (keyField: string, value: string): void => {
  form.value = {
    ...form.value,
    [keyField]: value,
  };
  offerIdFromUrl.value = "";
  offerId.value = value;
  validateErrorsForm(keyField, value);
};

const validateErrorsForm = (keyField: string, value: string): void => {
  switch (keyField) {
    case "offer":
      offerError.value = !value.length ? "Selecciona un opción" : "";
      break;
    default:
      break;
  }
};

const onDataRequest = (offerId: string) => {
  const [filteredOffer] = offerResults.value.filter(
    (offer) => offer.id === Number(offerId)
  );
  if (filteredOffer) {
    return {
      offerName: filteredOffer.name,
      zone: filteredOffer.city,
      salary: filteredOffer.salary,
      contract:
        filteredOffer.contract_type === 1 ? "Tiempo Completo" : "Medio Tiempo",
    };
  }
};

onMounted(async () => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `offers/owner/`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing offers",
    });
    dropdownOptions.value = [];
  } else {
    const mappedResponse = data.value.reduce((acc, offer) => {
      acc.push({ key: offer.id, value: offer.name });
      return acc;
    }, []);
    offerResults.value = data.value;
    dropdownOptions.value = mappedResponse;
  }
  const route = useRoute();
  const offerIdFromRoute = route.params.id || null;
  if (offerIdFromRoute) {
    const [filteredOffer] = dropdownOptions.value.filter((item) => {
      if (item.key === Number(offerIdFromRoute)) return item;
    });
    offerId.value = filteredOffer.key;
    offerIdFromUrl.value = filteredOffer.value;
  }
});
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.7rem;
}
</style>
