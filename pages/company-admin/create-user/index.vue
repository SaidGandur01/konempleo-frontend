<template>
  <NuxtLayout name="company-admin">
    <CompanyAdminCreateUser />
  </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "user-guard"],
});
</script>
<style lang="scss"></style>
