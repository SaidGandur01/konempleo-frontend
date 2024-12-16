<template>
  <NuxtLayout name="company">
    <h2>Lista de ofertas</h2>
    <CompanyResultsOffersTable />
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
