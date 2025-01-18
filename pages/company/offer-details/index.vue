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
    <CompanyResultsOfferDetailsTable :offer-id="currentSelection" />
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";

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
const currentSelection = ref<string>("");
  const { $toast } = useNuxtApp();
const helperStore = useHelperStore();
const userStore = useUserStore();
const token = userStore.getToken();
const dropdownOptions = ref([]);

const handleOnInput = (keyField: string, value: string): void => {
  form.value = {
    ...form.value,
    [keyField]: value,
  };
  offerIdFromUrl.value = "";
  currentSelection.value = value;
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
    // save data in local store for searching purposes
    const mappedResponse = data.value.reduce((acc, offer) => {
      acc.push({ key: offer.id, value: offer.name });
      return acc;
    }, []);
    dropdownOptions.value = mappedResponse;
  }
  const route = useRoute();
  const offerId = route.params.id || null;
  if (offerId) {
    const [filteredOffer] = dropdownOptions.value.filter((item) => {
      if (item.key === Number(offerId)) return item;
    });
    currentSelection.value = filteredOffer.key; // we are having dups companies waiting for fix on backend
    offerIdFromUrl.value = filteredOffer.value;
  }
});
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.7rem;
}
</style>
