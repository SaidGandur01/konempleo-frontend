<template>
  <NuxtLayout name="super-admin">
    <SuperEditCompany :company-id="companyId"/>
  </NuxtLayout>
</template>
<script lang="ts" setup>
const companyId = ref<string>("");
definePageMeta({
  middleware: ["protected", "user-guard"],
  path: "/super-admin/companies/edit/:id?",
});
onMounted(() => {
  const route = useRoute();
  const idFromRoute = (route.params.id as string) || null;
  companyId.value = idFromRoute ? idFromRoute : "";
});
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.7rem;
}
</style>
