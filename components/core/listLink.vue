<template>
  <li :class="{ 'active-item': isActive(props.redirect) }" @click="$router.push(props.redirect)">
    <a class="item-field">
      <font-awesome-icon class="icon" :icon="[...props.icons]" />
      <span>{{ label }}</span>
    </a>
  </li>
</template>
<script lang="ts" setup>
interface ILinkProps {
  label: string;
  icons: string[];
  redirect: string
}

const props = withDefaults(defineProps<ILinkProps>(), {
  label: "Link label",
  icons: () => [['fas', 'link-slash']],
  redirect: "" // ask for default behavior
});
const route = useRoute()

const isActive = (path: string): boolean => {
  return route.path === path;
};

</script>
<style lang="scss" scoped>
li {
  margin-bottom: 10px;
  padding: 1.5rem 2rem;
  transition: transform 0.3s ease;

  &:hover {
    background-color: var(--background-color-slide-panel-hover-item);
    border-radius: 1rem;
  }

  &.active-item {
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
}
</style>
