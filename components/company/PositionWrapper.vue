<template>
  <div class="company-content">
    <div class="positions-container">
      <div class="form-container">
        <CompanyCreatePosition />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", 'user-guard'],
});
</script>
<style lang="scss" scoped>
.company-content {
  display: flex;

  .positions-container {
    flex: 1;
    padding: 5rem;
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
