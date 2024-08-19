<template>
  <div class="admin-container">
    <h1>This is my admin page</h1>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", 'admin-guard'],
});
</script>
<style lang="scss" scoped></style>
