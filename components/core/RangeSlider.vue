<template>
  <div class="slider-container">
    <span v-if="label">{{ label }}</span>
    <div class="slider-header">
      <div
        :style="{ left: leftLabelPosition + '%', position: 'absolute' }"
        class="label"
      >
        {{ formattedMinValue }}
      </div>
      <div
        :style="{
          left: rightLabelPosition + '%',
          position: 'absolute',
          transform: rightLabelPosition >= 80 ? 'translateX(-100%)' : 'none'
        }"
        class="label"
      >
        {{ formattedMaxValue }}
      </div>
    </div>
    <Slider
      v-model="value"
      :min="min"
      :max="max"
      :enable-cross="false"
      :dot-size="20"
      :height="6"
      :tooltip="'never'"
      :bg-style="{ backgroundColor: '#ffffff' }"
      :process-style="{ backgroundColor: '#FF4B4B' }"
      @drag-end="updateLabelPositions"
    />
    <div class="slider-footer">
      <span>{{ formatter(min) }}</span>
      <span>{{ formatter(max) }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Slider from "vue-3-slider-component";

interface InputProps {
  label?: string;
}
interface IRangeEmit {
  (event: "drag-end", value: { min: number; max: number }): void;
}
withDefaults(defineProps<InputProps>(), {
  label: "",
});
const min = 1000000;
const max = 10000000;
const value = ref([1000000, 4000000]);
const emit = defineEmits<IRangeEmit>();

const formattedMinValue = computed(() => formatter(value.value[0]));
const formattedMaxValue = computed(() => formatter(value.value[1]));

const leftLabelPosition = computed(() => {
  return ((value.value[0] - min) / (max - min)) * 100;
});
const rightLabelPosition = computed(() => {
  return ((value.value[1] - min) / (max - min)) * 100;
});

function updateLabelPositions() {
  const payload: { min: number; max: number } = {
    min: value.value[0],
    max: value.value[1],
  };
  emit("drag-end", payload);
}

function formatter(val: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(val);
}
</script>
<style lang="scss" scoped>
.slider-container {
  position: relative;
  width: 100%;
  padding: 0 2rem;

  span {
    color: var(--color-text-900);
    font-weight: 500;
    display: block;
    margin-bottom: 1rem;
    font-size: 1.4rem;
  }
  .slider-header {
    position: relative;
    height: 1.5rem;
  }
  .label {
    transition: left 0.2s ease-in-out;
    color: #ff4b4b;
    font-weight: 600;
  }
  .slider-footer {
    display: flex;
    justify-content: space-between;
  }
}
</style>
