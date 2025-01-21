<template>
  <NuxtLayout name="company">
    <h2>Importar Hojas de Vida para una Oferta</h2>
    <div class="form-field">
      <CoreDropdown
        :list-options="dropdownOptions"
        label="Nombre de la oferta"
        placeholder="Seleccione una opción"
        :should-emit-id="true"
        @select="(data) => handleOnDropdown(data)"
      />
    </div>
    <CompanyResultsCandidatesAvailable :offer-id="offerId" />
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";

definePageMeta({
  middleware: ["protected", "user-guard"],
});

const { $toast } = useNuxtApp();
const helperStore = useHelperStore();
const userStore = useUserStore();
const token = userStore.getToken();
const dropdownOptions = ref([]);
const offerId = ref<string | string[]>("");

const handleOnDropdown = (id: string | string[]) => {
  offerId.value = id;
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
    dropdownOptions.value = mappedResponse;
  }
});
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.7rem;
}
</style>
