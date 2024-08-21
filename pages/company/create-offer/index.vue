<template>
  <div class="create-offer-content">
    <div class="slide-wrapper">
      <CompanySlidePanel />
    </div>
    <div class="create-offer-container">
      <div class="logo-wrapper">
        <img :src="logo" alt="logo" >
      </div>
      <div class="content">
        <h2>This is my content</h2>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import logo from "~/public/images/logo.png";
</script>
<style lang="scss" scoped>
.create-offer-content {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 20%;
  }
  .create-offer-container {
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

      h2 {
        font-size: 1.7rem;
      }
    }
  }
}
</style>
