<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "company-admin-guard"],
});
onBeforeMount(() => {
  navigateTo('/company-admin/offers')
})
</script>