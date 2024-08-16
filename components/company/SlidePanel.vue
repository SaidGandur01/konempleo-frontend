<template>
  <div class="slide-panel">
    <div class="logo-wrapper">
      <img src="https://talent.deepvoicelabs.com/media/c23e85beb3d763fb2ea40ac62cb2badd346024911e684747777d6b46.png" alt="logo">
    </div>
    <ul>
      <li>
        <NuxtLink to="/home/position" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'users']"
            size="xl"
          />
          <span>Cargos | Habilidades</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/home/processes" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'chalkboard-user']"
            size="xl"
          />
          <span>Procesos</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/home/load-cvs" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['far', 'file']"
            size="xl"
          />
          <span>Carga CV's</span>
        </NuxtLink>
      </li>
      <li>
        <NuxtLink to="/home/deep-talent" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'chart-column']"
            size="xl"
          />
          <span>DeepTalent</span>
        </NuxtLink>
      </li>
    </ul>
    <div class="bottom-actions">
      <CoreButton
        size="sm"
        label="Cerrar sesión"
        :disabled="false"
        :full-width="true"
        @click="onHandleLogout"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useUserStore } from '~/store/user.store';

const userStore = useUserStore()

const onHandleLogout = (): void => {
  userStore.reset();
  navigateTo("/login");
};
</script>
<style lang="scss" scoped>
.slide-panel {
  display: flex;
  flex-direction: column;
  background-color: var(--background-color-secondary);
  font-family: "Avenir", sans-serif;
  height: 100%;
  padding: 10rem 2rem 2rem 2rem;

  .logo-wrapper {
    text-align: center;
    padding-bottom: 5rem;

    img {
      width: 50%;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    font-family: inherit;

    li {
      margin-bottom: 10px;
      padding: 2rem;
      font-family: inherit;

      .item-field {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        font-family: inherit;
        cursor: pointer;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }

        span {
          font-size: 1.8rem;
          margin-top: 5px;
          font-family: inherit;
        }
      }
    }
  }

  .bottom-actions {
    margin-top: auto;
    padding: 2rem;
  }
}
</style>
