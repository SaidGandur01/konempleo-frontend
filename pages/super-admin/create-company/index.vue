<template>
  <NuxtLayout name="super-admin">
    <SuperCreateCompany />
  </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", 'user-guard'],
});
</script>
<style lang="scss" scoped></style>
