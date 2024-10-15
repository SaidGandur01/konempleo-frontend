<template>
  <NuxtLayout name="super-admin">
    <SuperCreateCompany />
  </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "super-admin"],
});
</script>
<style lang="scss" scoped></style>
