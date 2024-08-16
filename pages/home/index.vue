<template>
  <div v-if="currentLayout">
    <NuxtLayout :name="currentLayout" />
  </div>
  <div v-else class="page-container spinner">
    <CoreSpinner />
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";
import { EUser } from "~/utils/enum";
import type { TLayouts } from "~/utils/types";

definePageMeta({
  middleware: ["protected"],
});

const userStore = useUserStore();
const currentLayout = ref<TLayouts>();

onBeforeMount(() => {
  const isAdminUser = userStore.isAdmin();
  currentLayout.value = isAdminUser ? EUser.ADMIN : EUser.COMPANY;
  navigateTo(currentLayout.value === EUser.ADMIN ? '/home' : '/home/position')
});
</script>
<style lang="scss" scoped>
.page-container {
  .spinner {
    display: grid;
    place-content: center;
    height: 100vh;
  }
}
</style>
