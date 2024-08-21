<template>
  <div class="create-offer-content">
    <div class="slide-wrapper">
      <CompanySlidePanel />
    </div>
    <div class="create-offer-container">
      <div class="content">
        <div class="tabs-container">
          <div
            class="tab create-position"
            :class="{ selected: currentTabSelected === 'position' }"
            @click="onHandleTabSelection('position')"
          >
            <span>Crear cargo</span>
          </div>
          <div
            class="tab create-process"
            :class="{ selected: currentTabSelected === 'process' }"
            @click="onHandleTabSelection('process')"
          >
            <span>Crear Proceso</span>
          </div>
          <div
            class="tab add-skill"
            :class="{ selected: currentTabSelected === 'skill' }"
            @click="onHandleTabSelection('skill')"
          >
            <span>Añadir habilidades</span>
          </div>
        </div>
        <div class="information">
          <CompanyPositionWrapper v-if="currentTabSelected === 'position'" />
          <CompanyProcessWrapper v-if="currentTabSelected === 'process'" />
          <CompanyAddSkills v-if="currentTabSelected === 'skill'" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "company-guard"],
});

type TSelectedTab = "position" | "process" | "skill";

const currentTabSelected = ref<TSelectedTab>("position");
const onHandleTabSelection = (tab: TSelectedTab): void => {
  currentTabSelected.value = tab;
};
</script>
<style lang="scss" scoped>
.create-offer-content {
  min-height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 20%;
  }
  .create-offer-container {
    flex: 1;
    padding: 5rem 5rem 25rem;
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

    .content {
      display: flex;
      flex-direction: column;
      gap: 3rem;
      width: 100%;

      h2 {
        font-size: 1.7rem;
      }

      .tabs-container {
        display: flex;
        align-items: center;
        width: 60%;
        border-radius: 10px;
        padding: 1rem;
        background-color: var(--background-color-secondary);
        gap: 1rem;
        margin: 0 auto;

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
    }
  }
}
</style>
