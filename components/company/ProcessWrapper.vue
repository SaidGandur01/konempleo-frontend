<template>
  <div class="company-content">
    <div class="processes-container">
      <div class="form-container">
        <CompanyCreateProcess />
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
  height: calc(100vh - 50%);
  display: flex;

  .processes-container {
    flex: 1;
    padding: 5rem 5rem 25rem;
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
