<template>
  <div class="company-layout">
    <div class="company-header">
      <CompanyHeader @toggle="(value: boolean) => onSlidePanelToggle(value)"/>
    </div>
    <div class="company-content">
      <div :class="['slide-wrapper', { expanded: isSlidePanelExpanded }]">
        <CompanySlidePanel />
      </div>
      <div class="offer-list-container">
        <div class="content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "company-guard"],
});
const isSlidePanelExpanded = ref<boolean>(true)

const onSlidePanelToggle = (value: boolean): void => {
  isSlidePanelExpanded.value = value;
}

</script>
<style lang="scss" scoped>
.company-layout {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .company-content {
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
    .offer-list-container {
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
        border: 1px solid #D1D5DC;
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