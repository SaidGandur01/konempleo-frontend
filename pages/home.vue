<template>
  <NuxtLayout :name="currentLayout">
    <div v-if="!isLoading" class="home-page">
      <h1>Home page</h1>
    </div>
    <div v-else class="home-page spinner">
      <CoreSpinner />
    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";
import type { TLayouts } from "~/utils/types";

definePageMeta({
  middleware: ["protected"],
});

const userStore = useUserStore()
const isLoading = ref<boolean>(true);
const currentLayout = ref<TLayouts>("company");

onMounted(() => {
  setTimeout(() => {
  
    const isAdminUser = userStore.isAdmin();
    currentLayout.value = isAdminUser ? 'admin' : 'company'
    isLoading.value = false
  }, 2500);
})

</script>
<style lang="scss" scoped>
.spinner {
  display: grid;
  place-content: center;
  height: 100vh;
}
</style>

