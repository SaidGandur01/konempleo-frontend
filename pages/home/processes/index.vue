<template>
  <NuxtLayout name="company">
    <div class="processes-container">
      <h1>This is my processes page</h1>
    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected"],
  roles: ['company']
});
</script>
<style lang="scss" scoped></style>