<template>
  <div class="super-admin-wrapper">
    <div class="super-header">
      <SuperHeader @toggle="(value: boolean) => onSlidePanelToggle(value)"/>
    </div>
    <div class="super-admin-content">
      <div :class="['slide-wrapper', { expanded: isSlidePanelExpanded }]">
        <SuperSlidePanel />
      </div>
      <div class="company-container">
        <div class="content">
          <h2>Lista de Empresas</h2>
          <SuperResultsCompaniesTable />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "super-admin"],
});

const isSlidePanelExpanded = ref<boolean>(true)

const onSlidePanelToggle = (value: boolean): void => {
  isSlidePanelExpanded.value = value;
}

</script>
<style lang="scss" scoped>
.super-admin-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  .super-admin-content {
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
  
    .company-container {
      flex: 1;
      align-items: center;
      background-color: var(--background-color-primary);
      display: flex;
      flex-direction: column;
      gap: 2rem;
      height: 100vh;
      justify-content: flex-start;
      overflow-y: scroll;
      padding: 5rem 5rem 15rem;
  
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
}
</style>
