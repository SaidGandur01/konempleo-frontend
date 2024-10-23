<template>
  <div class="slide-panel">
    <div class="logo-wrapper">
      <img :src="kLogo" alt="logo">
    </div>
    <ul>
      <li :class="{ 'active-item': isActive('/super-admin/companies') }">
        <NuxtLink to="/super-admin/companies" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'list-check']"
            size="lg"
          />
          <span>Lista de Empresas</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/super-admin/offer-details') }">
        <NuxtLink to="/super-admin/offer-details" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'building']"
            size="lg"
          />
          <span>Ofertas por empresa</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/super-admin/offers') }">
        <NuxtLink to="/super-admin/offers" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'list-check']"
            size="lg"
          />
          <span>Lista de ofertas</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/super-admin/create-company') }">
        <NuxtLink to="/super-admin/create-company" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'house-flag']"
            size="lg"
          />
          <span>Crear Empresa</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/super-admin/create-user') }">
        <NuxtLink to="/super-admin/create-user" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'users']"
            size="lg"
          />
          <span>Crear Usuario</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/super-admin/users') }">
        <NuxtLink to="/super-admin/users" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'people-group']"
            size="lg"
          />
          <span>Lista de usuarios</span>
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
  return route.path.startsWith(path);
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
      cursor: pointer;

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
