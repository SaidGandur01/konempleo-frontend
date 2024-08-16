<template>
  <div class="admin-content">
    <div v-if="!isLoading" class="home-page">
      <h1>Admin home page</h1>
      <slot />
    </div>
    <div v-else class="home-page spinner">
      <CoreSpinner />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { EUser } from '~/utils/enum';

const isLoading = ref<boolean>(true);

definePageMeta({
  middleware: ["protected"],
  roles: [EUser.ADMIN]
});

onMounted(() => {
  // setTimeout(() => {
    isLoading.value = false
  // }, 2500);
})
</script>
<style lang="scss" scoped>
.spinner {
  display: grid;
  place-content: center;
  height: 100vh;
}
</style>