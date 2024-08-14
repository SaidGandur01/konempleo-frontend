<template>
  <NuxtLayout :name="currentLayout" />
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";
import type { TLayouts } from "~/utils/types";

definePageMeta({
  middleware: ["protected"],
});

const userStore = useUserStore();
const currentLayout = ref<TLayouts>("company");

onMounted(() => {
  const isAdminUser = userStore.isAdmin();
  currentLayout.value = isAdminUser ? "admin" : "company";
});
</script>
<style lang="scss" scoped>
.spinner {
  display: grid;
  place-content: center;
  height: 100vh;
}
</style>
