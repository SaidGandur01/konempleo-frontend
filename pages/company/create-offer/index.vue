<template>
  <div class="create-offer-content">
    <div class="slide-wrapper">
      <CompanySlidePanel />
    </div>
    <div class="create-offer-container">
      <div class="content">
        <div v-if="false" class="tabs-container">
          <div
            class="tab create-position"
            :class="{ selected: currentTabSelected === 'position' }"
            @click="onHandleTabSelection('position')"
          >
            <span>Crear cargo</span>
          </div>
          <div
            class="tab create-offer"
            :class="{ selected: currentTabSelected === 'offer' }"
            @click="onHandleTabSelection('offer')"
          >
            <span>Crear Oferta</span>
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
          <CompanyOfferWrapper />
          <CompanyPositionWrapper v-if="false" />
          <CoreAddSkills v-if="false" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "company-guard"],
});

type TSelectedTab = "position" | "offer" | "skill";

const currentTabSelected = ref<TSelectedTab>("position");
const onHandleTabSelection = (tab: TSelectedTab): void => {
  currentTabSelected.value = tab;
};
</script>
<style lang="scss" scoped>
.create-offer-content {
  height: 100vh;
  display: flex;

  .slide-wrapper {
    width: 20%;
  }
  .create-offer-container {
    align-items: center;
    background-color: var(--background-color-primary);
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 2rem;
    height: 100vh;
    justify-content: flex-start;
    overflow-y: scroll;
    padding: 2rem 5rem;

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
          background-color: #ec6b62;
          font-weight: 700;
          transition: all 0.2s ease;
          color: white;
        }

        .tab {
          cursor: pointer;
          padding: 1rem;
          text-align: center;
          width: 50%;
          transition: all 0.3s ease;

          &:hover {
            border-radius: 6px;
            background-color: #ec6b62;
            color: white;
          }
        }
      }
    }
  }
}
</style>
