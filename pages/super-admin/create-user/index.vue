<template>
  <NuxtLayout name="super-admin">
    <SuperCreateUser />
  </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "super-admin"],
});
</script>
<style lang="scss" scoped></style>
