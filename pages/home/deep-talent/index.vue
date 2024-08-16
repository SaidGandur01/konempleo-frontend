<template>
  <NuxtLayout name="company">
    <div class="deep-talent-container">
      <h1>This is my deep talent page</h1>
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
