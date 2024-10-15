<template>
  <div class="slide-panel">
    <div class="logo-wrapper">
      <img :src="logo" alt="logo">
    </div>
    <ul>
      <li :class="{ 'active-item': isActive('/company-admin/offers') }">
        <NuxtLink to="/company-admin/offers" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'list-check']"
            size="xl"
          />
          <span>Lista de ofertas</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/company-admin/offer-details') }">
        <NuxtLink to="/company-admin/offer-details" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'chart-column']"
            size="xl"
          />
          <span>Detalle de oferta</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/company-admin/create-offer') }">
        <NuxtLink to="/company-admin/create-offer" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'list-check']"
            size="xl"
          />
          <span>Crear oferta</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/company-admin/load-cvs') }">
        <NuxtLink to="/company-admin/load-cvs" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['far', 'file']"
            size="xl"
          />
          <span>Carga CV's</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/company-admin/create-user') }">
        <NuxtLink to="/company-admin/create-user" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'users']"
            size="xl"
          />
          <span>Crear Usuario</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/company-admin/users') }">
        <NuxtLink to="/company-admin/users" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'people-group']"
            size="xl"
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
import logo from "~/public/images/deepvoice-logo.png";

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
  background-color: var(--background-color-secondary);
  // font-family: "Avenir", sans-serif;
  // font-family: 'Source Sans Pro', sans-serif;
  font-family: ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  height: 100vh;
  padding: 4rem 2rem 2rem 2rem;

  .logo-wrapper {
    text-align: center;
    padding-bottom: 5rem;

    img {
      width: 50%;
      background: white;
      border-radius: 50%;
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
          font-size: 1.5rem;
          margin-top: 5px;
          font-family: inherit;
        }
      }

      &.active-item {
        background-color: var(--color-brand);
        border-radius: 1rem;
      }
    }
  }

  .bottom-actions {
    margin-top: 7rem;
  }
}
</style>
