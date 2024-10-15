<template>
  <div class="company-admin-content">
    <div class="slide-wrapper">
      <CompanyAdminSlidePanel />
    </div>
    <div class="create-user-container">
      <div class="content">
        <CompanyAdminCreateUser />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "company-admin-guard"],
});
</script>
<style lang="scss">
.company-admin-content {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 15%;
  }
  .create-user-container {
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
