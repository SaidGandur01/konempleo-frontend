<template>
  <div class="slide-panel">
    <ul>
      <CoreListLink
        v-for="(link, index) in availableLinks"
        :key="index"
        :label="link.label"
        :icons="link.icons"
        :redirect="link.redirect"
      />
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
import { useUserStore } from "~/store/user.store";
import { getUserRoleNavMapping } from "~/utils/helpers/common";

const userStore = useUserStore();
const role = userStore.getUserRole();
const availableLinks = getUserRoleNavMapping(role);

const onHandleLogout = (): void => {
  userStore.reset();
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
