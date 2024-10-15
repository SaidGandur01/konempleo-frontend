<template>
  <div class="company-header">
    <div class="left-section">
      <div class="menu">
        <font-awesome-icon
          class="icon"
          :icon="['fas', 'bars']"
          size="lg"
          @click="toggleMenu"
        />
      </div>
      <span class="rol"><strong>RECLUTADOR</strong></span>
    </div>
    <div class="middle-section">
      <div class="logo">
        <img src="https://konempleo.com/assets/logo-konempleo.png" alt="logo" >
      </div>
    </div>
    <div class="right-section">
      <div class="avatar">
        <font-awesome-icon class="icon" :icon="['fas', 'user-tie']" size="lg" />
      </div>
      <div class="name">
        <span><strong>Marcelo</strong> Saldias</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: ["protected", "super-admin"],
});
interface IEmits {
  (event: 'toggle', value: boolean): void;
}

const isMenuExpanded = ref<boolean>(true)
const emit = defineEmits<IEmits>();

const toggleMenu = (): void => {
  isMenuExpanded.value = !isMenuExpanded.value
  emit('toggle', isMenuExpanded.value);
}
</script>
<style lang="scss" scoped>
.company-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 2rem;
  border-bottom: 5px solid var(--background-color-primary);

  .left-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding-left: 1rem;

    .menu {
      .icon {
        cursor: pointer
      }
    }
  }
  .middle-section {
    .logo {
      img {
        margin-left: 8rem;
        width: 50%;
      }
    }
  }
  .right-section {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
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
  }
}
</style>
