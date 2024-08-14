<template>
  <div class="container"/>
</template>
<script lang="ts" setup>
import { useUserStore } from '~/store/user.store';

const useStore = useUserStore()

onMounted(() => {
  const isAuthenticated = useStore.isUserAuthenticated()
  
  if (!isAuthenticated) {
    navigateTo('/login')
  }
  navigateTo("/home");
})
</script>
