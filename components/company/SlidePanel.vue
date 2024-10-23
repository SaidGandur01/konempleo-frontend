<template>
  <div class="slide-panel">
    <div class="logo-wrapper">
      <img :src="kLogo" alt="logo">
    </div>
    <ul>
      <li :class="{ 'active-item': isActive('/company/offer-list') }">
        <NuxtLink to="/company/offer-list" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'hippo']"
            size="lg"
          />
          <span>Lista de ofertas</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/company/offer-details') }">
        <NuxtLink to="/company/offer-details" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'chart-column']"
            size="lg"
          />
          <span>Detalle de oferta</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/company/create-offer') }">
        <NuxtLink to="/company/create-offer" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'user-tie']"
            size="lg"
          />
          <span>Crear oferta</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/company/load-cvs') }">
        <NuxtLink to="/company/load-cvs" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['far', 'file']"
            size="lg"
          />
          <span>Carga CV's</span>
        </NuxtLink>
      </li>
    </ul>
    <div class="bottom-actions">
      <CoreButton
        size="md"
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
import kLogo from '~/public/images/ke_logo_dark.png'

const userStore = useUserStore()
const route = useRoute()

const onHandleLogout = (): void => {
  userStore.reset();
  navigateTo("/login");
};

const isActive = (path: string): boolean => {
  return route.path === path;
};

</script>
<style lang="scss" scoped>
.slide-panel {
  display: flex;
  flex-direction: column;
  background-color: var(--background-color-slide-panel);
  font-family: ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  height: 100vh;
  padding: 4rem 1rem 2rem 1rem;

  .logo-wrapper {
    text-align: center;
    padding-bottom: 5rem;

    img {
      width: 45%;
      background: white;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    font-family: inherit;

    li {
      margin-bottom: 10px;
      padding: 1.5rem 2rem;
      font-family: inherit;
      transition: transform 0.3s ease;

      &:hover {
        background-color: var(--background-color-slide-panel-hover-item);
        border-radius: 1rem;
      }

      .item-field {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        font-family: inherit;
        cursor: pointer;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.02);
        }

        span {
          font-size: 1.5rem;
          font-family: inherit;
          white-space: nowrap;
        }
      }

      &.active-item {
        background-color: var(--background-color-slide-panel-hover-item);
        border-radius: 1rem;
      }
    }
  }

  .bottom-actions {
    position: fixed;
    bottom: 15%;
    margin: 0 auto;
    width: 80%;
    left: 0;
    right: 0;
  }
}
</style>
