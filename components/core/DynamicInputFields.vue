<template>
  <div class="dynamic-input-fields">
    <label v-if="label" :for="id">
      {{ label }}
      <span v-if="required" class="required">*</span>
    </label>
    <div
      v-for="(field, index) in fields"
      :key="index"
      :class="inputWrapperClasses"
    >
      <input
        :id="id"
        v-model="fields[index]"
        type="text"
        :placeholder="placeholder"
        class="input-field"
        @input="onInput(index, ($event.target as HTMLInputElement).value)"
      >
      <CoreButton
        label=""
        size="custom"
        :has-minus-icon="true"
        @click="removeField(index)"
      />
    </div>
    <CoreButton
      full-width
      label=""
      size="sm"
      :has-plus-icon="true"
      @click="addField"
    />
  </div>
</template>

<script lang="ts" setup>
interface IDynamicInputFieldProps {
  initialFields: Array<string>;
  placeholder: string;
  label?: string;
  required?: boolean;
  id: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const props = withDefaults(defineProps<IDynamicInputFieldProps>(), {
  initialFields: () => [""],
  placeholder: "Enter value",
  label: undefined,
  required: false,
  id: undefined,
  size: "md",
});

const emit = defineEmits(["update:fields"]);

const fields = ref([...props.initialFields]);

const inputWrapperClasses = computed(() => ({
  "field-wrapper": true,
  "field-wrapper--sm": props.size === "sm",
  "field-wrapper--md": props.size === "md",
  "field-wrapper--lg": props.size === "lg",
  "field-wrapper--xl": props.size === "xl",
}));

const addField = () => {
  fields.value.push("");
  emit("update:fields", fields.value);
};

const removeField = (index: number) => {
  if (fields.value.length > 1) {
    fields.value.splice(index, 1);
    emit("update:fields", fields.value);
  }
};

const onInput = (index: number, value: string) => {
  fields.value[index] = value;
  emit("update:fields", fields.value);
};
</script>

<style lang="scss" scoped>
.dynamic-input-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  label {
    color: var(--color-text-200);
    font-weight: 600;
    display: block;
    font-size: 1.4rem;
  }

  .field-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .input-field {
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

      .input-field {
        padding: 0.75rem;
      }
    }

    &--md {
      .input-field {
        padding: 1.25rem;
      }
    }

    &--lg {
      font-size: 1.8rem;

      .input-field {
        padding: 1.75rem;
      }
    }

    &--xl {
      font-size: 2rem;

      .input-field {
        padding: 2.25rem;
      }
    }
  }
}
</style>
