<template>
  <div class="kpi-wrapper box-shadow-xl">
    <div class="header">
      <div class="information">
        <span v-if="titleOne" class="title-one">{{ titleOne }}</span>
        <span v-if="titleTwo" :class="titleTwoClasses">
          {{ titleTwo }}
          <span v-if="titleTwoChildren">{{ titleTwoChildren }}</span>
        </span>
      </div>
      <div v-if="hasIcon" class="icon">
        <font-awesome-icon
          class="icon"
          :icon="[iconTagOne, iconTagTwo]"
          size="xl"
          :style="{ color: iconColor }"
        />
      </div>
    </div>
    <div :class="contentClasses">
      <span v-if="descriptionOne" class="description-one">
        <font-awesome-icon v-if="hasIncreased" :icon="['fas', 'arrow-up']" size="sm" />
        <font-awesome-icon v-if="hasDecreased" :icon="['fas', 'arrow-down']" size="sm" />
        {{ descriptionOne }}
      </span>
      <span v-if="descriptionTwo" class="description-two">{{ descriptionTwo }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
interface IProps {
  titleOne: string;
  titleTwo: string;
  titleTwoFontSize: boolean;
  titleTwoChildren: string;
  descriptionOne: string;
  descriptionTwo: string;
  hasIcon: boolean;
  iconColor: string;
  iconTagOne: string;
  iconTagTwo: string;
  hasIncreased: boolean;
  hasDecreased: boolean;
  type: "success" |  "pending" | "danger" | "default"
}

const props = withDefaults(defineProps<IProps>(), {
  titleOne: "",
  titleTwo: "",
  titleTwoFontSize: false,
  titleTwoChildren: "",
  descriptionOne: "",
  descriptionTwo: "",
  hasIcon: false,
  iconColor: "",
  iconTagOne: "",
  iconTagTwo: "",
  hasIncreased: false,
  hasDecreased: false,
  type: "default"
});
const titleTwoClasses = computed(() => ({
  'title-two': true,
  'title-two-font-size': props.titleTwoFontSize
}));
const contentClasses = computed(() => ({
  "content": true,
  "content--success": props.type === 'success',
  "content--pending": props.type === 'pending',
  "content--danger": props.type === 'danger',
  "content--default": props.type === 'default',
}));
</script>
<style lang="scss" scoped>
.kpi-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 1.5rem;
  min-width: 220px;
  border: 1px #d1d5dc solid;
  border-radius: 1rem;
  padding: 1rem 2rem;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .information {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      span {
        font-family: "Source Sans Pro", sans-serif !important;
        letter-spacing: 0.5px;
      }

      .title-one {
        color: var(--color-brand-neutral-500);
        font-weight: 600;
      }
      .title-two {
        font-size: 2.5rem;
        font-weight: 700;

        &-font-size {
          padding-top: 0.5rem;
          font-size: 4.5rem;

          span {
            color: red;
            font-size: 2rem;
            font-weight: 600;
          }
        }
      }
    }
    .icon {
      display: flex;
      align-items: center;
    }
  }

  .content {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;

    span {
      font-family: "Source Sans Pro", sans-serif !important;
      letter-spacing: 0.5px;
    }

    &--success {
      .description-one {
        background-color: #ccf5e6;
        color: var(--color-success);
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        font-weight: 600;
      }
    }
    &--pending {
      .description-one {
        background-color: #ffe9e4;
        color: var(--color-pending);
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        font-weight: 600;
      }
    }
    &--danger {
      .description-one {
        background-color: #FED8E0;
        color: var(--color-danger);
        padding: 0.5rem 1rem;
        border-radius: 1rem;
        font-weight: 600;
      }
    }
    &--default {
      .description-one {
        font-weight: 600;
        padding: 0.5rem 0;
        border-radius: 1rem;
      }
      .description-two {
        color: var(--color-brand-neutral-500);
        font-weight: 600;
      }
    }
  }
}
</style>
