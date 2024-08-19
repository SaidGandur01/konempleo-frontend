<template>
  <div class="company-content">
    <div class="slide-wrapper">
      <CompanySlidePanel />
    </div>
    <div class="deep-talent-container">
      <h1>This is my deep talent page</h1>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "company-guard"],
});
</script>
<style lang="scss" scoped>
.company-content {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 20%;
  }
  .deep-talent-container {
    display: flex;
    flex: 1;
    background-color: var(--background-color-primary);
  }
} 
</style>
