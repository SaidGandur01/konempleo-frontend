<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "super-admin"],
});
onBeforeMount(() => {
  navigateTo('/super-admin/companies')
})
</script>