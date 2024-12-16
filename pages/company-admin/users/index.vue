<template>
  <NuxtLayout name="company-admin">
    <h2>Lista de Usuarios</h2>
    <CompanyAdminResultsUsersTable />
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
