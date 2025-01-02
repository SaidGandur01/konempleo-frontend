<template>
  <div class="search-bar">
    <label v-if="label" for="search-bar-id">
      {{ label }}
    </label>
    <div :class="searchBarWrapper">
      <div class="icon">
        <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      </div>
      <input
        id="search-bar-id"
        v-model="inputValue"
        type="text"
        :placeholder="placeHolder"
        class="search-bar--wrapper__input"
        @blur="inputFocused = false"
        @focus="inputFocused = true"
        @input="debouncedFn()"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useDebounceFn } from "@vueuse/core";

interface SearchBarProps {
  label?: string | undefined;
  placeHolder?: string;
  minLengthSearchCriteria: number;
}
interface HandleInputValueEmits {
  (event: "input", value: string): void;
  (event: "click"): void;
}

const inputFocused = ref<boolean>(false);
const inputValueEmit = defineEmits<HandleInputValueEmits>();
const inputValue = ref<string>("");
const props = withDefaults(defineProps<SearchBarProps>(), {
  label: undefined,
  minLengthSearchCriteria: 2,
  placeHolder: "Search",
});

const debouncedFn = useDebounceFn(
  () => {
    if (inputValue.value.trim().length >= props.minLengthSearchCriteria) {
      inputValueEmit("input", inputValue.value);
    } else if (inputValue.value.trim().length === 0) {
      inputValueEmit("input", "");
    }
  },
  props.minLengthSearchCriteria > 0 ? 300 : 0,
  { maxWait: 5000 }
);

const searchBarWrapper = computed(() => ({
  "search-bar--wrapper": true,
  "search-bar--wrapper-focused": inputFocused.value,
}));
</script>
<style lang="scss" scoped>
.search-bar {
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
  border: 1px darken($color: #f9fafb, $amount: 10%) solid;

  label {
    color: var(--color-brand-neutral-400);
    margin-bottom: 0.5rem;
  }

  &--wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    background: var(--color-field-background);
    border: 1px var(--color-neutral-border) solid;
    border-radius: 0.5rem;
    color: var(--color-brand-neutral-400);
    width: 100%;

    .icon {
      padding-left: 1rem;
    }

    input {
      all: unset;
      color: var(--color-text-default);
      padding: 1.25rem 1.25rem 1.25rem 1rem;
      width: 100%;
      border: none;

      &::placeholder {
        color: var(--color-field-readonly-text);
        opacity: 1;
      }

      &[disabled] {
        background: var(--color-disabled-background);
        color: var(--color-disabled-text);
        cursor: not-allowed;
      }
    }

    &-focused {
      border-radius: 0.5rem;
      border-color: var(--color-brand-primary-900);
      outline: 3px var(--color-brand-primary-900) solid;
    }
  }
}
</style>
