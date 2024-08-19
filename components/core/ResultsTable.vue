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
  processName: string;
}
const props = withDefaults(defineProps<ITableProps>(), {
  processName: ""
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const results = ref<any>([])
watch(() => props.processName, (newValue: string) => {
  console.log('new value: ', newValue)
})
</script>
<style lang="scss" scoped>
.results-table {
  .no-data {
    padding: 2rem;
    background: #3E3C1E;
    width: 100%;
    display: flex;
    border-radius: 1rem;
    color: #FFFFC1;
    font-weight: 600;
  }
}
</style>
