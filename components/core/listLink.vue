<template>
  <li
    :class="{ 'active-item': isActive(props.redirect) }"
    @click="$router.push(props.redirect)"
  >
    <a class="item-field">
      <font-awesome-icon
        class="icon"
        :icon="[...props.icons]"
        :style="{ color: '#176382' }"
      />
      <span>{{ label }}</span>
    </a>
  </li>
</template>
<script lang="ts" setup>
interface ILinkProps {
  label: string;
  icons: string[];
  redirect: string;
}

const props = withDefaults(defineProps<ILinkProps>(), {
  label: "Link label",
  icons: () => ["fas", "link-slash"],
  redirect: "",
});

const isActive = (path: string) => {
  const route = useRoute();
  const currentRouteArr = route.path.split("/");
  const uniqPath = path.split("/").at(-1) as string;
  return currentRouteArr.includes(uniqPath);
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
    color: #34aac5;
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
