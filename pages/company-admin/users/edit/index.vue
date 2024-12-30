<template>
  <NuxtLayout name="company-admin">
    <CompanyAdminEditUser :user-id="userId"/>
  </NuxtLayout>
</template>
<script lang="ts" setup>
const userId = ref<string>("");
definePageMeta({
  middleware: ["protected", "user-guard"],
  path: "/company-admin/users/edit/:id?",
});
onMounted(() => {
  const route = useRoute();
  const idFromRoute = (route.params.id as string) || null;
  userId.value = idFromRoute ? idFromRoute : "";
});
</script>
<style lang="scss" scoped>
</style>
