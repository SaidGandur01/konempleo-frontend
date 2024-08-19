<template>
  <div class="container" />
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "admin-guard", "company-guard"],
});
</script>
