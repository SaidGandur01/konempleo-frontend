<template>
  <div :id="id" class="dropwdown">
    <label v-if="label" :for="id">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div class="body">
      <div class="label-wrapper" @click="toggleCategoryDropdown">
        <span v-if="currentSelection === ''">{{ placeholder }}</span>
        <span v-else>{{ currentSelection }}</span>
        <font-awesome-icon
          v-if="!renderDropdownOptions"
          size="lg"
          :icon="['fas', 'caret-down']"
        />
        <font-awesome-icon v-else size="lg" :icon="['fas', 'caret-up']" />
      </div>
      <div
        v-if="renderDropdownOptions"
        v-click-outside="onEmitValue"
        :class="contentClasses"
      >
        <span
          v-for="(item, index) in listOptions"
          :key="index"
          @click="onEmitValue(item)"
          >{{ item.value }}</span
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface IListOptions {
  key: string;
  value: string;
}
interface InputProps {
  label?: string;
  id?: string;
  required?: boolean;
  placeholder?: string;
  listOptions?: IListOptions[] | undefined;
  maxHeight?: string;
}
interface IDropdownEmit {
  (event: "select", value: string): void;
}
const props = withDefaults(defineProps<InputProps>(), {
  label: "Label test",
  id: "id-test-one",
  required: true,
  placeholder: "Select a country",
  listOptions: undefined,
  maxHeight: ''
});
const currentSelection = ref<string>("");
const emit = defineEmits<IDropdownEmit>();
const renderDropdownOptions = ref<boolean>(false);
const toggleCategoryDropdown = (): void => {
  renderDropdownOptions.value = !renderDropdownOptions.value;
};
const closeDropdown = (): void => {
  renderDropdownOptions.value = false;
};
const contentClasses = computed(() => ({
  "content": true,
  "content--custom-height": props.maxHeight !== ""
}));
const onEmitValue = (item?: IListOptions): void => {
  if (item?.key) {
    currentSelection.value = item.value;
    emit("select", item.key);
  } else {
    currentSelection.value = "";
    emit("select", "");
  }
  closeDropdown();
};
</script>
<style lang="scss" scoped>
.dropwdown {
  width: 100%;
  label {
    color: var(--color-text-900);
    font-weight: 600;
    display: block;
    margin-bottom: 0.75rem;
  }

  .label-wrapper {
    cursor: pointer;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-right: 2rem;
    align-items: center;
  }

  .body {
    position: relative;
    background: var(--background-input-field);
    border: 1px var(--color-neutral-border) solid;
    border-radius: 0.5rem;
    color: var(--color-text-900);
    font-size: inherit;
    width: 100%;
    padding: 1.25rem;
  }

  .content {
    z-index: 1002;
    width: 100%;
    position: absolute;
    top: 100%;
    left: 0;
    display: flex;
    flex-direction: column;
    background: var(--background-input-field);
    border: 1px solid var(--color-brand-light-gray);
    max-height: 250px;
    overflow: auto;
    scroll-behavior: smooth;

    &--custom-height {
      max-height: 100px;
    }

    & span {
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s;
    }

    & span:not(:last-child) {
      border-bottom: 1px solid var(--color-brand-light-gray);
    }

    & span:hover {
      background-color: lighten($color: #363744, $amount: 10%);
    }
  }
}
</style>
