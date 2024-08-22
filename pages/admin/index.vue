<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "admin-guard"],
});
onBeforeMount(() => {
  navigateTo('/admin/board')
})
</script>