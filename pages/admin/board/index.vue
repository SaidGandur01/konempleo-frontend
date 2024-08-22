<template>
  <div class="admin-content">
    <div class="slide-wrapper">
      <AdminSlidePanel />
    </div>
    <div class="board-container">
      <div class="logo-wrapper">
        <img :src="logo" alt="logo" />
      </div>
      <div class="content box-shadow-2xl">
        <h2>Gestionar Empresas</h2>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import logo from "~/public/images/logo.png";

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
    padding: 5rem 5rem 25rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    gap: 2rem;
    background-color: var(--background-color-primary);

    .logo-wrapper {
      text-align: center;

      img {
        width: 50%;
      }
    }

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
