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
const isLoading = ref<boolean>(false);

definePageMeta({
  middleware: ["protected"],
  roles: ['company']
});

onMounted(() => {
  // // setTimeout(() => {
  //   console.log('entramos a company')
  // navigateTo("/home/position");
  // isLoading.value = false;
  // }, 2500);
});
</script>
<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  display: flex;

  .content {
    background-color: green;
  }
}
</style>
