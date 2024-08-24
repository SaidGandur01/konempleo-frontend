<template>
  <div :class="buttonContainerClasses">
    <button :class="classes" :disabled="disabledRef" @click="onHandleClick">
      <span v-if="!isLoading && label">{{ label }}</span>
      <span v-if="!isLoading && hasPlusIcon">
        <font-awesome-icon
        class="icon"
        :icon="[iconPlusTagOne, iconPlusTagTwo]"
        size="lg"
      />
    </span>
      <span v-if="!isLoading && hasMinusIcon">
        <font-awesome-icon
        class="icon"
        :icon="[iconMinusTagOne, iconMinusTagTwo]"
        size="lg"
      />
      </span>
      <span v-if="isLoading">
        <font-awesome-icon :icon="['fas', 'circle-notch']" spin />
      </span>
    </button>
  </div>
</template>
<script lang="ts" setup>
type TButton = "neutral" | "submit" | "null";
type TSizeButton = "sm" | "md" | "lg" | "custom";
interface IButtonProps {
  label: string;
  type: TButton;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: TSizeButton;
  makeSmallerInMobile?: boolean;
  timeButtonSpinner?: number;
  hasPlusIcon?: boolean;
  iconPlusTagOne?: string;
  iconPlusTagTwo?: string;
  hasMinusIcon?: boolean;
  iconMinusTagOne?: string;
  iconMinusTagTwo?: string;
}
interface IButtonEmits {
  (event: "click"): void;
}
const props = withDefaults(defineProps<IButtonProps>(), {
  label: "Button label",
  type: "null",
  disabled: false,
  fullWidth: false,
  size: "md",
  makeSmallerInMobile: false,
  timeButtonSpinner: 0,
  hasPlusIcon: false,
  hasMinusIcon: false,
  iconPlusTagOne: 'fas',
  iconPlusTagTwo: 'plus',
  iconMinusTagOne: 'fas',
  iconMinusTagTwo: 'minus'
});

const disabledRef = ref<boolean>(props.disabled);
const isLoading = ref<boolean>(false);
const emit = defineEmits<IButtonEmits>();

const buttonContainerClasses = computed(() => ({
  "button-container": true,
  "button-container--full-width": props.fullWidth,
}));
const classes = computed(() => ({
  "core-button": true,
  "core-button--full-width": props.fullWidth,
  "core-button--neutral": props.type === "neutral",
  "core-button--submit": props.type === "submit",
  "core-button--sm": props.size === "sm",
  "core-button--lg": props.size === "lg",
  "core-button--custom": props.size === "custom",
  "core-button--make-smaller": props.makeSmallerInMobile,
}));

const onHandleClick = (): void => {
  if (props.type === "submit") {
    isLoading.value = true;
    setTimeout(
      () => {
        isLoading.value = false;
      },
      props.timeButtonSpinner !== 0 ? props.timeButtonSpinner : 500
    );
  }
  emit("click");
};

watch(
  () => props.disabled,
  (newValue: boolean) => {
    disabledRef.value = newValue;
  }
);
</script>
<style lang="scss" scoped>
$submit-color: #004d80;
.button-container {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: fit-content;

  &--full-width {
    width: 100% !important;
  }
  .core-button {
    background-color: #30C2DB;
    border-radius: 1rem;
    border: 1px solid darken($color: #30C2DB, $amount: 5%);
    color: var(--color-text-900);
    cursor: pointer;
    font-size: 1.6rem;
    font-weight: 400;
    min-width: 150px;
    padding: 1.5rem 2rem;
    text-transform: capitalize;
    transition: all 0.3s ease;
    width: 100%;

    &:hover {
      background-color: darken($color: #30C2DB, $amount: 10%);
    }

    &[disabled] {
      background-color: var(--color-brand-neutral-700);
      border: none;
      cursor: not-allowed;
    }

    &--sm {
      padding: 0.7rem 1.7rem;
      min-width: fit-content;
    }

    &--custom {
      padding: 1rem 1.3rem;
      min-width: fit-content;
    }

    &--lg {
      min-width: 250px;
    }

    &--make-smaller {
      min-width: 10rem !important;
      font-size: 1rem;
      font-weight: bold;
    }

    &--neutral {
      background-color: transparent;
      // border: 1px solid var(--color-field-readonly-border);
    }

    &--submit {
      background-color: var(--color-brand-info-500);
      color: var(--color-brand-neutral-900);
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background-color: lighten($submit-color, 10%);
      }
    }

    &--full-width {
      width: 100% !important;
    }
  }
}
</style>
