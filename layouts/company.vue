<template>
  <div class="company-content">
    <div v-if="!isLoading" class="home-page">
      <div class="slide-wrapper">
        <CompanySlidePanel />
      </div>
      <div class="content">
        <slot />
      </div>
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
  roles: [EUser.COMPANY]
});

onMounted(() => {
  // // setTimeout(() => {
  //   console.log('entramos a company')
  // navigateTo("/home");
  isLoading.value = false;
  // }, 2500);
});
</script>
<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 20%;
  }

  .content {
    display: flex;
    flex: 1;
    background-color: green;
  }
}
</style>
