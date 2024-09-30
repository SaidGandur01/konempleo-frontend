<template>
  <div class="company-admin-content">
    <div class="slide-wrapper">
      <CompanyAdminSlidePanel />
    </div>
    <div class="offers-container">
      <div class="content">
        <h2>Lista de ofertas</h2>
        <CoreResultsCompanyAdminOffersTable :offer-name="currentSelection" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { offerListData } from "~/data/offer/offer";

definePageMeta({
  middleware: ["protected", "company-admin-guard"],
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
.company-admin-content {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 15%;
  }
  .offers-container {
    align-items: center;
    background-color: var(--background-color-primary);
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 2rem;
    height: 100vh;
    justify-content: flex-start;
    overflow-y: scroll;
    padding: 7rem 5rem;

    .content {
      display: flex;
      flex-direction: column;
      border: 1px solid #d1d5dc;
      gap: 3rem;
      width: 100%;
      padding: 2rem;
      border-radius: 1rem;
      background-color: var(--background-color-secondary);

      h2 {
        font-size: 1.7rem;
      }
    }
  }
}
</style>
