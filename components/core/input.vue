<template>
  <div :class="parentClasses">
    <label v-if="label" :for="id">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <input
      :id="id"
      ref="input"
      v-model="inputValue"
      :class="inputClasses"
      :autocomplete="autocomplete"
      :disabled="disabled"
      :name="name"
      :max="max"
      :min="min"
      :maxlength="maxLength"
      :minlength="minLength"
      :pattern="pattern"
      :readonly="readonly"
      :required="required"
      :step="step"
      :type="inputType"
      :placeholder="placeholder"
      @blur="onBlur"
      @change="onChange"
      @input="onInput"
      @keypress="onKeyPress"
    />
  </div>
</template>

<script lang="ts" setup>
type InputType = "text" | "number" | "email" | "tel" | "password";

interface InputProps {
  autocomplete?: "on" | "off";
  disabled?: boolean;
  id: string;
  error?: boolean;
  focus?: boolean;
  label?: string;
  max?: string | number | undefined;
  min?: string | number | undefined;
  maxLength?: string | undefined;
  minLength?: string | undefined;
  name: string;
  mode?: "default" | "dark";
  pattern?: string;
  placeholder?: string | undefined;
  readonly?: boolean;
  required?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  step?: number | undefined;
  type?: InputType;
  value?: string | number | undefined;
  warning?: boolean;
  showPassword?: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
  autocomplete: "on",
  disabled: false,
  error: false,
  focus: false,
  max: undefined,
  min: undefined,
  maxLength: undefined,
  minLength: undefined,
  mode: "default",
  pattern: undefined,
  placeholder: undefined,
  readonly: false,
  label: undefined,
  name: undefined,
  required: false,
  size: "md",
  step: undefined,
  type: "text",
  value: undefined,
  warning: false,
  showPassword: false,
});

const parentClasses = computed(() => ({
  "form-input": true,
  "form-input--dark": props.mode === "dark",
  "form-input--sm": props.size === "sm",
  "form-input--md": props.size === "md",
  "form-input--lg": props.size === "lg",
  "form-input--xl": props.size === "xl",
}));

const inputClasses = computed(() => ({
  "has-error": props.error,
  "has-warning": props.warning,
}));

interface InputEmits {
  (event: "blur", value: string): void;

  // eslint-disable-next-line @typescript-eslint/unified-signatures
  (event: "change", value: string): void;

  // eslint-disable-next-line @typescript-eslint/unified-signatures
  (event: "input", value: string): void;

  // eslint-disable-next-line @typescript-eslint/unified-signatures
  (event: "press", value: string): void;
}

const emit = defineEmits<InputEmits>();

const onBlur = (event: Event) => {
  emit("blur", (event.target as HTMLInputElement).value);
};
const onChange = (event: Event) => {
  emit("change", (event.target as HTMLInputElement).value);
};
const onInput = (event: Event) => {
  emit("input", (event.target as HTMLInputElement).value);
};
const onKeyPress = (event: KeyboardEvent) => {
  emit("press", event.key);
};

const input = ref<HTMLInputElement>();
const inputValue = ref<string | number | undefined>(props.value);
const inputType = ref<InputType>(props.type);

onMounted(() => {
  if (props.focus && input) {
    input.value?.focus();
  }
  if (props.showPassword && input) {
    inputType.value = "text";
  }
});

watch(
  () => props.focus,
  (newValue) => {
    if (newValue) {
      input.value?.focus();
    } else {
      input.value?.blur();
    }
  }
);

watch(
  () => props.showPassword,
  (newValue) => {
    if (newValue) {
      inputType.value = "text";
    } else {
      inputType.value = "password";
    }
  }
);
</script>

<style lang="scss" scoped>
.form-input {
  label {
    color: var(--color-text-200);
    // color: var(--color-text-900);
    font-weight: 500;
    display: block;
    margin-bottom: 1rem;
    font-size: 1.4rem;
  }

  input {
    background: var(--background-input-field);
    border: 1px #d1d5dc solid;
    border-radius: 1rem;
    color: var(--color-text-200);
    font-size: 1.6rem;
    width: 100%;

    &::-ms-reveal {
      display: none;
    }

    &::placeholder {
      color: #6b7280;
      opacity: 1;
    }

    &.toggle-shown {
      padding-right: 5rem;
    }

    &:focus {
      border-color: #d1d5dc;
      outline: 1px var(--color-brand-neutral-400) solid;
      background: var(--background-input-field);
    }

    &[readonly] {
      background: var(--color-field-readonly-background);
      border-color: var(--color-field-readonly-border);
      color: var(--color-field-readonly-text);
      pointer-events: none;
    }

    &[disabled] {
      background: var(--color-disabled-background);
      color: var(--color-disabled-text);
      cursor: not-allowed;
    }

    &.has-error {
      border-color: var(--color-brand-danger-500);
      color: var(--color-brand-danger-500);
    }
    &.has-warning {
      border-color: var(--color-brand-warn-500);
      color: var(--color-brand-warn-500);
    }
  }

  &--sm {
    font-size: 1.2rem;

    input {
      padding: 0.75rem;
    }
  }

  &--md {
    input {
      padding: 1.25rem;
    }
  }

  &--lg {
    font-size: 1.8rem;

    input {
      padding: 1.75rem;
    }
  }

  &--xl {
    font-size: 2rem;

    input {
      padding: 2.25rem;
    }
  }

  .toggle-visibility {
    background: transparent;
    border: 0;
    bottom: calc(1.125rem + 1px); // Account for border px
    cursor: pointer;
    font-size: inherit;
    height: 1.5em;
    left: auto;
    position: absolute;
    right: 1.5rem;
    top: auto;
    z-index: 2;

    svg {
      display: block;
      fill: var(--color-brand-neutral-400);
      height: 1.5em;
    }
  }

  &--dark {
    label {
      color: var(--color-white-50a);
    }

    input {
      color: var(--color-white-80a);
      background-color: var(--color-white-05a);
      border-color: transparent;
    }
  }
}
</style>
