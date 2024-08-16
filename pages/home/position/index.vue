<template>
  <NuxtLayout name="company">
    <div class="positions-container">
      <div class="logo-wrapper">
        <img :src="logo" alt="logo" >
      </div>
      <div class="tabs-container">
        <div
          class="tab create-position"
          :class="{ selected: currentTabSelected === 'position' }"
          @click="onHandleTabSelection('position')"
        >
          <span>Crear cargo</span>
        </div>
        <div
          class="tab add-skills"
          :class="{ selected: currentTabSelected === 'skill' }"
          @click="onHandleTabSelection('skill')"
        >
          <span>Añadir habilidades</span>
        </div>
      </div>
      <div class="form-container">
        <CompanyCreatePosition v-if="currentTabSelected === 'position'"/>
        <CompanyAddSkills v-else />
      </div>
    </div>
  </NuxtLayout>
</template>
<script lang="ts" setup>
import logo from "~/public/images/logo.png";

type TSelectedTab = "position" | "skill";





definePageMeta({
  middleware: ["protected"],
  roles: ["company"],
});

const currentTabSelected = ref<TSelectedTab>("position");

const onHandleTabSelection = (tab: TSelectedTab): void => {
  currentTabSelected.value = tab;
};




</script>
<style lang="scss" scoped>
.positions-container {
  width: 100%;
  padding: 5rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  background-color: var(--background-color-primary);

  .logo-wrapper {
    text-align: center;

    img {
      width: 50%;
    }
  }

  .tabs-container {
    display: flex;
    align-items: center;
    width: 100%;
    border-radius: 10px;
    padding: 1rem;
    background-color: var(--background-color-secondary);
    gap: 1rem;

    .selected {
      border-radius: 6px;
      background-color: #ff4b4b;
      font-weight: 700;
      transition: all 0.2s ease;
    }

    .tab {
      cursor: pointer;
      padding: 1rem;
      text-align: center;
      width: 50%;
    }
  }

  .form-container {
    width: 100%;
  }
}
</style>
