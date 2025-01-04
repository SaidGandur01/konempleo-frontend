<template>
  <NuxtLayout name="company-admin">
    <h2>Lista de ofertas</h2>
    <CompanyAdminResultsOffersTable />
  </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "user-guard"],
});
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.7rem;
}
</style>
