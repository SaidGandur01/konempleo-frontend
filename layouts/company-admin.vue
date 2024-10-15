<template>
  <div class="company-admin-wrapper">
    <div class="company-admin-header">
      <CompanyAdminHeader @toggle="(value: boolean) => onSlidePanelToggle(value)"/>
    </div>
    <div class="company-admin-content">
      <div :class="['slide-wrapper', { expanded: isSlidePanelExpanded }]">
        <CompanyAdminSlidePanel />
      </div>
      <div class="offers-container">
        <div class="content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { offerListData } from "~/data/offer/offer";

definePageMeta({
  middleware: ["protected", "company-admin-guard"]
});
const currentSelection = ref<string>("");
const offerIdFromUrl = ref<string>("");
const isSlidePanelExpanded = ref<boolean>(true)

const onSlidePanelToggle = (value: boolean): void => {
  isSlidePanelExpanded.value = value;
}

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

.company-admin-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .company-admin-content {
    min-height: 100vh;
    display: flex;
  
    .slide-wrapper {
      transition: transform 0.3s ease-in-out, flex-basis 0.3s ease-in-out;
      transform: translateX(0);
      flex: 0 0 15%;
      overflow: hidden;
  
      &.expanded {
        flex: 0 0 15%;
        transform: translateX(0);
      }
  
      &:not(.expanded) {
        flex: 0 0 0;
        transform: translateX(-100%);
      }
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
      padding: 4rem 4rem 15rem;
  
      .content {
        display: flex;
        flex-direction: column;
        border: 1px solid #d1d5dc;
        gap: 3rem;
        width: 100%;
        padding: 2rem;
        border-radius: 1rem;
        background-color: var(--background-color-secondary);
      }
    }
  }
}
</style>
