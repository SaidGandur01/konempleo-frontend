<template>
  <div class="container" />
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected"],
});

onMounted(() => {
  navigateTo("/home");
});
</script>
