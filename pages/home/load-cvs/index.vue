<template>
  <NuxtLayout name="company">
    <div class="load-cvs-container">
      <h1>This is my load cvs page</h1>
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