<template>
  <div class="date-range">
    <vue-date-picker
      v-model="date"
      range
      :multi-calendars="{ count: 2 }"
      :action-row="{ showNow: true }"
      :max-date="new Date()"
      :year-range="[2024, Number(new Date(getYear(new Date()) + 5))]"
      :offset="15"
      :state="state"
      :month-change-on-scroll="false"
      :teleport="true"
      format="dd/MM/yyyy"
      type="date"
      position="left"
      placeholder="Select a date range"
      hide-offset-dates
      class="custom-date-picker"
      @update:model-value="onHandleDate"
      @cleared="onClearDate"
    />
  </div>
</template>
<script lang="ts" setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { getYear } from "date-fns";

interface IDateRangeEmits {
  (event: "change", value: string[]): void;
}

defineProps<{
  onClearDate: () => void;
}>();

const date = ref();
const state = ref<boolean>(true);
const dateRangeEmit = defineEmits<IDateRangeEmits>();

const onHandleDate = (modelData: Date[]): void => {
  if (!modelData || !modelData.length) {
    state.value = false;
    return;
  }
  if (modelData.some((date: any) => !date)) {
    state.value = false;
    return;
  }
  const isSameDate = modelData[0].getTime() === modelData[1].getTime();
  if (isSameDate) {
    state.value = false;
  } else {
    state.value = true;
    const UTCdates = modelData.map((date: Date) => {
      return date.toISOString();
    });
    dateRangeEmit("change", UTCdates);
  }
};
</script>
<style lang="scss">
.date-range {
  width: 100%;

  > div {
    width: 100%;
    height: 100%;
    border: none;
    padding: 0;
    font-size: 24px;
  }

  .custom-date-picker .dp__input {
    width: 100%;
    font-size: 16px;
    padding: 1.25rem 1.25rem 1.25rem 5.25rem;
    border-radius: 1rem;
  }

  .custom-date-picker .dp__input_icon,
  .custom-date-picker .dp--clear-btn > svg {
    width: 16px;
    height: 16px;
  }
}
</style>
