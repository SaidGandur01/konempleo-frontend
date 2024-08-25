<template>
  <div class="content-wrapper">
    <h1>Super Admin page</h1>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "super-admin"],
});
onBeforeMount(() => {
  navigateTo('/super-admin')
})
</script>
<style lang="scss" scoped></style>
