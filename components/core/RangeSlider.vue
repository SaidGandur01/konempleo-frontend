<template>
  <div class="slider-container">
    <span v-if="label">{{ label }}</span>
    <div v-if="props.singleSlide" class="slider-header">
      <div
        :style="{
          left: currentValuPosition + '%',
          position: 'absolute',
        }"
        class="label"
      >
        {{ currentValue }}
      </div>
    </div>
    <div v-else class="slider-header">
      <div
        :style="{
          left: leftLabelPosition + '%',
          position: 'absolute',
          transform: leftLabelPosition >= 18 ? 'translateX(-100%)' : 'none',
        }"
        class="label"
      >
        {{ formattedMinValue }}
      </div>
      <div
        :style="{
          left: rightLabelPosition + '%',
          position: 'absolute',
          transform: rightLabelPosition >= 80 ? 'translateX(-100%)' : 'none',
        }"
        class="label"
      >
        {{ formattedMaxValue }}
      </div>
    </div>
    <Slider
      v-model="scaledValue"
      :min="scaledMin"
      :max="scaledMax"
      :enable-cross="false"
      :dot-size="20"
      :height="6"
      :tooltip="'never'"
      :step="step"
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
  label: string;
  minValue: number;
  maxValue: number;
  maxInitialValue: number;
  multiplier: number;
  singleSlide: boolean;
  isCurrency: boolean;
}

const props = withDefaults(defineProps<InputProps>(), {
  label: "",
  minValue: 0,
  maxValue: 0,
  maxInitialValue: 0,
  multiplier: 1,
  singleSlide: false,
  isCurrency: false,
});

export interface IRange {
  min: number;
  max: number;
}

interface IRangeEmit {
  (event: "drag-end", value: number | IRange): void;
}

const min = props.minValue;
const max = props.maxValue;
const step = props.multiplier;
const scaledMin = Math.floor(min / step);
const scaledMax = Math.ceil(max / step);

const scaledValue = props.singleSlide
  ? ref<number>(props.minValue)
  : ref<any>([min / step, Math.ceil(props.maxInitialValue / step)]);

const emit = defineEmits<IRangeEmit>();

const currentValue = computed(() => formatter(scaledValue.value * step));

const formattedMinValue = computed(() =>
  formatter(scaledValue.value[0] * step)
);

const formattedMaxValue = computed(() =>
  formatter(scaledValue.value[1] * step)
);

const currentValuPosition = computed(() => {
  return ((scaledValue.value - scaledMin) / (scaledMax - scaledMin)) * 100;
});

const leftLabelPosition = computed(() => {
  return ((scaledValue.value[0] - scaledMin) / (scaledMax - scaledMin)) * 100;
});

const rightLabelPosition = computed(() => {
  return ((scaledValue.value[1] - scaledMin) / (scaledMax - scaledMin)) * 100;
});

function updateLabelPositions() {
  if (props.singleSlide) {
    const payload: number = scaledValue.value * step;
    emit("drag-end", payload);
    return;
  }
  const payload: { min: number; max: number } = {
    min: scaledValue.value[0] * step,
    max: scaledValue.value[1] * step,
  };
  emit("drag-end", payload);
}

function formatter(val: number) {
  if (props.isCurrency) {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(val);
  }
  return val;
}
</script>
<style lang="scss" scoped>
.slider-container {
  position: relative;
  width: 100%;
  padding: 0 2rem;

  span {
    color: var(--color-text-200);
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
