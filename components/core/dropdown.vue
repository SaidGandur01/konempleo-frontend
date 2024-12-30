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
        v-if="!props.multipleSelect && renderDropdownOptions"
        v-click-outside="onClickOutside"
        :class="contentClasses"
        :style="{ '--dropdown-max-height': props.maxHeight || 'none' }"
      >
        <div v-if="props.shouldShowSearchBar" class="search-container">
          <CoreSearchBar
            :min-length-search-criteria="1"
            @input="onHandleSearch"
          />
        </div>
        <span
          v-for="(item, index) in listOptionsClean"
          :key="index"
          @click="onEmitValue(item)"
          >{{ item.value }}</span
        >
      </div>
      <div
        v-else-if="props.multipleSelect && renderDropdownOptions"
        v-click-outside="onClickOutside"
        :class="contentClasses"
        :style="{ '--dropdown-max-height': props.maxHeight || 'none' }"
      >
        <div v-if="props.shouldShowSearchBar" class="search-container">
          <CoreSearchBar
            :min-length-search-criteria="1"
            @input="onHandleSearch"
          />
        </div>
        <div
          v-for="(item, index) in listOptionsClean"
          :key="index"
          class="box-wrapper"
          @click.stop
        >
          <input
            :id="'checkbox-item-' + index"
            type="checkbox"
            :value="item.key"
            :checked="selectedValues.includes(item.key)"
            class="box"
            @change="onEmitValue(item)"
          />
          <label :for="'checkbox-item-' + index" class="box-label">{{
            item.value
          }}</label>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
export interface IListOptions {
  key: string | number;
  value: string;
}
interface InputProps {
  label?: string;
  id?: string;
  required?: boolean;
  placeholder?: string;
  listOptions?: IListOptions[] | undefined;
  maxHeight?: string;
  shouldEmitId?: boolean;
  multipleSelect?: boolean;
  shouldShowSearchBar?: boolean;
}
interface IDropdownEmit {
  (event: "select", value: string | string[]): void;
}
const props = withDefaults(defineProps<InputProps>(), {
  label: "Label test",
  id: "id-test-one",
  required: true,
  placeholder: "Select a country",
  listOptions: undefined,
  maxHeight: "",
  shouldEmitId: false,
  multipleSelect: false,
  shouldShowSearchBar: false,
});
const currentSelection = ref<string>("");
const selectedValues = ref<string[]>([]);
const listOptionsSearch = ref<IListOptions[]>([]);
const listOptionsClean = computed(() =>
  props.shouldShowSearchBar ? listOptionsSearch.value : props.listOptions
);
const emit = defineEmits<IDropdownEmit>();
const renderDropdownOptions = ref<boolean>(false);

const onHandleSearch = (searchValue: string): void => {
  listOptionsSearch.value = props.listOptions.filter((item) => {
    const name = item.value.toLowerCase();
    return name.includes(searchValue.toLowerCase());
  });
};

const toggleCategoryDropdown = (): void => {
  renderDropdownOptions.value = !renderDropdownOptions.value;
};

const closeDropdown = (): void => {
  renderDropdownOptions.value = false;
  listOptionsSearch.value = props.listOptions;
};

const contentClasses = computed(() => ({
  content: true,
  "content-custom-height": !!props.maxHeight, // Add class only if maxHeight is provided
}));

const onClickOutside = () => {
  if (props.multipleSelect) {
    closeDropdown();
  } else {
    onEmitValue();
  }
};

const onEmitValue = (item?: IListOptions): void => {
  if (props.multipleSelect) {
    // Handle multiple selections
    if (item?.key) {
      const selectedNames = (): string[] => {
        return (
          props.listOptions
            ?.filter((item) => selectedValues.value.includes(item.key))
            .map((item) => item.value) || []
        );
      };
      const index = selectedValues.value.findIndex((key) => key === item.key);
      if (index === -1) {
        // Add the item if it's not already selected
        selectedValues.value.push(item.key);
        currentSelection.value = selectedNames()[0];
      } else {
        // Remove the item if it's already selected
        selectedValues.value.splice(index, 1);
        currentSelection.value =
          selectedValues.value.length < 1 ? "" : selectedNames()[0];
      }
      // Emit the array of selected keys or values
      if (props.shouldEmitId) {
        emit("select", selectedValues.value); // Emit selected keys
      } else {
        emit("select", selectedNames()); // Emit selected values
      }
    }
  } else {
    if (item?.key) {
      currentSelection.value = item.value;
      if (props.shouldEmitId) {
        emit("select", item.key);
      } else {
        emit("select", item.value);
      }
    } else {
      currentSelection.value = "";
      emit("select", "");
    }
    closeDropdown();
  }
  listOptionsSearch.value = props.listOptions;
};

onMounted(() => {
  listOptionsSearch.value = props.listOptions;
});

watch(
  () => props.listOptions,
  (newListOption) => {
    listOptionsSearch.value = newListOption;
  }
);
</script>
<style lang="scss" scoped>
.dropwdown {
  width: 100%;
  label {
    color: var(--color-text-200);
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
    border: 1px #d1d5dc solid;
    border-radius: 1rem;
    color: var(--color-text-200);
    font-size: inherit;
    width: 100%;
    padding: 1.25rem;
  }

  .search-container {
    padding: 0.5rem 1rem;
    position: sticky;
    top: 0;
    background-color: var(--background-input-field);
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
    border: 1px #d1d5dc solid;
    border-radius: 1rem;
    max-height: 250px;
    overflow: auto;
    scroll-behavior: smooth;

    &-custom-height {
      max-height: var(--dropdown-max-height);
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
      background-color: var(--color-brand-neutral-700);
    }

    & .box-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      // padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s;

      .box-label {
        width: 100%;
        margin: 0;
        cursor: pointer;
        padding: 1.5rem;
        font-weight: unset;
      }

      .box {
        margin-left: 1rem;
        border-radius: 3px;
        width: 1.3rem;
        height: 1.3rem;
      }

      .box:focus {
        outline: none;
        box-shadow: 0 0 0 2px transparent;
      }
    }

    & .box-wrapper:hover {
      background-color: var(--color-brand-neutral-700);
    }
  }
}
</style>
