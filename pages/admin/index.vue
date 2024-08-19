<template>
  <div class="admin-content">
    <div class="home-page">
      <h1>Admin home page</h1>
      <slot />
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "admin-guard"]
});
</script>
<style lang="scss" scoped>
.admin-content {
  h1 {
    color: var(--color-text-100);
  }
}
</style>
