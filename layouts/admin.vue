<template>
  <div class="admin-content">
    <div v-if="!isLoading" class="home-page">
      <h1>Admin home page</h1>
    </div>
    <div v-else class="home-page spinner">
      <CoreSpinner />
    </div>
  </div>
</template>
<script lang="ts" setup>
const isLoading = ref<boolean>(true);

definePageMeta({
  middleware: ["protected"],
  roles: ['admin']
});

onMounted(() => {
  // setTimeout(() => {
  console.log('entramos a admin')
    isLoading.value = false
  // }, 2500);
})
</script>