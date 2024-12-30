<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "user-guard", "route-guard"]
});
</script>
