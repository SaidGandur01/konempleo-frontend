<template>
  <div class="company-content">
    <div class="home-page">
      <div class="slide-wrapper">
        <CompanySlidePanel />
      </div>
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { EUser } from "~/utils/enum";

definePageMeta({
  middleware: ["protected"],
  roles: [EUser.COMPANY],
});
</script>
<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 20%;
  }

  .content {
    display: flex;
    flex: 1;
    background-color: var(--background-color-primary);
  }
}
</style>
