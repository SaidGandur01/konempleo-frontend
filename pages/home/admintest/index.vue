<template>
  <NuxtLayout name="admin">    
    <div class="admin-container">
      <h1>This is my admin page</h1>
    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected"],
  roles: ['admin']
});
</script>
<style lang="scss" scoped></style>
