<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "company-guard"],
});
onBeforeMount(() => {
  navigateTo('/company/create-offer')
})
</script>