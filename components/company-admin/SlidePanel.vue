<template>
  <div class="slide-panel">
    <ul>
      <li :class="{ 'active-item': isActive('/company-admin/offers') }">
        <NuxtLink to="/company-admin/offers" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'list-check']"
          />
          <span>Lista de ofertas</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/company-admin/offer-details') }">
        <NuxtLink to="/company-admin/offer-details" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'chart-column']"
          />
          <span>Detalle de oferta</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/company-admin/create-offer') }">
        <NuxtLink to="/company-admin/create-offer" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'list-check']"
          />
          <span>Crear oferta</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/company-admin/load-cvs') }">
        <NuxtLink to="/company-admin/load-cvs" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['far', 'file']"
          />
          <span>Carga CV's</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/company-admin/create-user') }">
        <NuxtLink to="/company-admin/create-user" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'users']"
          />
          <span>Crear Usuario</span>
        </NuxtLink>
      </li>
      <li :class="{ 'active-item': isActive('/company-admin/users') }">
        <NuxtLink to="/company-admin/users" class="item-field">
          <font-awesome-icon
            class="icon"
            :icon="['fas', 'people-group']"
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
  height: 100vh;
  padding: 1rem 1rem 2rem 1rem;

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

    li {
      margin-bottom: 10px;
      padding: 1.5rem 2rem;
      transition: transform 0.3s ease;

      &:hover {
        background-color: var(--background-color-slide-panel-hover-item);
        border-radius: 1rem;
      }

      .item-field {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        cursor: pointer;
        transition: transform 0.3s ease;

        &:hover {
          transform: scale(1.02);
        }

        span {
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
