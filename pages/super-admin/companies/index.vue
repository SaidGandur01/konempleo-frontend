<template>
  <NuxtLayout name="super-admin">
    <h2>Lista de Empresas</h2>
    <SuperResultsCompaniesTable />
  </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", 'user-guard'],
});
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.7rem;
}
</style>
