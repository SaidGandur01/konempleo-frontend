<template>
  <div class="company-content">
    <div class="offers-container">
      <div class="form-container">
        <CompanyCreateOffer />
      </div>
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
  display: flex;

  .offers-container {
    flex: 1;
    padding: 5rem 5rem 7rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 2rem;
    background-color: var(--background-color-primary);

    .form-container {
      width: 100%;
    }
  }
} 
</style>
