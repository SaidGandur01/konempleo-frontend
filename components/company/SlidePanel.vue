<template>
  <div class="slide-panel">
    <h1>This is the slide panel</h1>
    <ul>
      <li><NuxtLink to="/home/position">Position Page</NuxtLink></li>
      <li><NuxtLink to="/home/processes">Processes Page</NuxtLink></li>
      <li><NuxtLink to="/home/load-cvs">Load cvs Page</NuxtLink></li>
      <li><NuxtLink to="/home/deep-talent">Deep talent Page</NuxtLink></li>
    </ul>
  </div>
</template>
<script lang="ts" setup></script>
<style lang="scss" scoped>
.slide-panel {
  background-color: red;
  height: 100%;
  ul {
    list-style: none;
    padding: 0;
    li {
      margin-bottom: 10px;
    }
  }
}
</style>
