<template>
  <div class="company-content">
    <div class="slide-wrapper">
      <CompanySlidePanel />
    </div>
    <div class="processes-container">
      <div class="logo-wrapper">
        <img :src="logo" alt="logo" >
      </div>
      <div class="form-container">
        <CompanyCreateProcess />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import logo from "~/public/images/logo.png";

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
  .processes-container {
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

    .form-container {
      width: 100%;
    }
  }
} 
</style>
