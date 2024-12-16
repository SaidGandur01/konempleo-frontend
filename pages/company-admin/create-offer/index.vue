<template>
  <NuxtLayout name="company-admin">
    <CompanyAdminCreateOffer />
  </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "user-guard"],
});
</script>
<style lang="scss" scoped></style>
