<template>
  <div class="admin-content">
    <div class="slide-wrapper">
      <AdminSlidePanel />
    </div>
    <div class="board-container">
      <div class="content box-shadow-2xl">
        <h2>Lista de Empresas</h2>
        <CoreRsultsCompaniesTable />
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
    width: 20%;
  }
  .board-container {
    flex: 1;
    padding: 7rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 2rem;
    background-color: var(--background-color-primary);

    .content {
      display: flex;
      flex-direction: column;
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
