<template>
  <NuxtLayout :name="currentLayout" />
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";
import type { TLayouts } from "~/utils/types";

const userStore = useUserStore();
const currentLayout = ref<TLayouts>("company");

onMounted(() => {
  const isAdminUser = userStore.isAdmin();
  currentLayout.value = isAdminUser ? "admin" : "company";

  definePageMeta({
    middleware: ["protected"],
    roles: [isAdminUser ? "admin" : "company"]
  });
});
</script>
<style lang="scss" scoped>
.spinner {
  display: grid;
  place-content: center;
  height: 100vh;
}
</style>
