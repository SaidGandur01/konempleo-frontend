<template>
  <NuxtLayout name="company-admin">
    <h2>Lista de ofertas</h2>
    <CompanyAdminResultsOffersTable :offer-name="currentSelection" />
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { offerListData } from "~/data/offer/offer";
definePageMeta({
  path: "/company-admin/offers/:id?",
});
const currentSelection = ref<string>("");
const offerIdFromUrl = ref<string>("");

onMounted(() => {
  const route = useRoute();
  const offerId = route.params.id || null;
  if (offerId) {
    offerIdFromUrl.value = offerId[0];
    currentSelection.value = offerListData[0].value;
  }
});
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.7rem;
}
</style>
