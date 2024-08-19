<template>
  <div class="company-content">
    <div class="slide-wrapper">
      <CompanySlidePanel />
    </div>
    <div class="positions-container">
      <div class="logo-wrapper">
        <img :src="logo" alt="logo" />
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
        <CompanyCreatePosition v-if="currentTabSelected === 'position'" />
        <CompanyAddSkills v-else />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import logo from "~/public/images/logo.png";

type TSelectedTab = "position" | "skill";

const currentTabSelected = ref<TSelectedTab>("position");
const onHandleTabSelection = (tab: TSelectedTab): void => {
  currentTabSelected.value = tab;
};

definePageMeta({
  middleware: ["protected", "company-guard"],
});
</script>
<style lang="scss" scoped>
.company-content {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 20%;
  }
  .positions-container {
    flex: 1;
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
}
</style>
