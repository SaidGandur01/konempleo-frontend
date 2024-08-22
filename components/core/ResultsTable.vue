<template>
  <div class="results-table">
    <div v-if="results && results.length" class="table-wrapper">
      <h1>This is my results table</h1>
    </div>
    <div v-else class="no-data">
      <span>No existen datos para mostrar</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface ITableProps {
  offerName: string;
}
const props = withDefaults(defineProps<ITableProps>(), {
  offerName: ""
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const results = ref<any>([])
watch(() => props.offerName, (newValue: string) => {
  console.log('new value: ', newValue)
})
</script>
<style lang="scss" scoped>
.results-table {
  .no-data {
    padding: 2rem;
    background: var(--color-brand-neutral-700);
    width: 100%;
    display: flex;
    border-radius: 1rem;
    color: var(--color-text-200);
    font-weight: 600;
  }
}
</style>
