<template>
  <div class="admin-content">
    <div class="slide-wrapper">
      <AdminSlidePanel />
    </div>
    <div class="create-company-container">
      <div class="content">
        <AdminCreateCompany />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "admin-guard"],
});
</script>
<style lang="scss" scoped>
.admin-content {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 15%;
  }
  .create-company-container {
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
