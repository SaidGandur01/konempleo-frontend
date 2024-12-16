<template>
  <div class="header">
    <div class="left-section">
      <div class="menu">
        <font-awesome-icon
          class="icon"
          :icon="['fas', 'bars']"
          size="lg"
          @click="toggleMenu"
        />
      </div>
      <span class="rol"
        ><strong>{{ userHeaderText }}</strong></span
      >
    </div>
    <div class="middle-section">
      <div class="logo">
        <img :src="kLogo" alt="logo" />
      </div>
    </div>
    <div class="right-section">
      <div class="avatar">
        <font-awesome-icon class="icon" :icon="['fas', 'user-tie']" size="lg" />
      </div>
      <div class="name">
        <!-- get the right user firstName lastName -->
        <span><strong>{{firstName}}</strong> {{lastName}}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import kLogo from "~/public/images/KE_solok.png";
import { useUserStore } from "~/store/user.store";
import { getUserHeaderText } from "~/utils/helpers/common";

definePageMeta({
  middleware: ["protected", 'user-guard'],
});
interface IEmits {
  (event: "toggle", value: boolean): void;
}

const userStore = useUserStore();
const role= userStore.getUserRole();
const userName = userStore.getUserName().split(" ");
const firstName = userName[0]
const lastName = userName.at(-1)
const userHeaderText = getUserHeaderText(role);


const isMenuExpanded = ref<boolean>(true);


const emit = defineEmits<IEmits>();

const toggleMenu = (): void => {
  isMenuExpanded.value = !isMenuExpanded.value;
  emit("toggle", isMenuExpanded.value);
};
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 2rem;
  border-bottom: 5px solid var(--background-color-primary);

  .left-section {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding-left: 1rem;
    width: 20%;

    .menu {
      .icon {
        cursor: pointer;
      }
    }
  }
  .middle-section {
    .logo {
      img {
        width: 7%;
        margin: 0 auto;
      }
    }
  }
  .right-section {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    width: 20%;
    .avatar {
      height: 30px;
      width: 30px;
      background-color: darken($color: #f5f9fc, $amount: 5%);
      border-radius: 50%;
      position: relative;

      .icon {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .name {
      text-transform: capitalize;
    }
  }
}
</style>
