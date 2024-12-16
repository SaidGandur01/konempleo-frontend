<template>
  <div class="container" />
</template>
<script lang="ts" setup>
import 'flowbite';
definePageMeta({
  middleware: ["protected", 'user-guard'],
});
</script>
