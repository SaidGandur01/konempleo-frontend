<template>
  <div v-if="show" class="modal">
    <div v-if="isGifModal" class="modal-content gif">
      <span>{{ title }}</span>
      <img
        :src="gifSrc"
        :alt="placeholder"
        class="loading-gif"
        style="filter: hue-rotate(180deg) saturate(200%) invert(100%)"
      />
      <span>{{ subtitle }}</span>
    </div>
    <div v-else class="modal-content input">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <div class="tooltip">
          <font-awesome-icon
            :icon="['fas', 'xmark']"
            :style="{ color: 'gray' }"
            size="lg"
            @click="onClose"
          />
          <span class="tooltiptext">Cerrar</span>
        </div>
      </div>
      <div class="modal-body">
        <textarea v-model="comment" :placeholder="placeholder" />
      </div>
      <div class="modal-footer">
        <CoreButton
          size="sm"
          :label="primaryButtonText"
          type="submit"
          :disabled="disableButton"
          @click="onSubmit"
        />
        <CoreButton
          size="sm"
          :label="secondaryButtonText"
          type="neutral"
          @click="onClose"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import gifSrc from "~/public/gifs/cloud-animation.gif";

interface ModalProps {
  show: boolean;
  title: string;
  subtitle?: string;
  placeholder?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  isGifModal?: boolean;
}
interface ModalEmits {
  (event: "close"): void;
  (event: "submit", value: string): void;
}

withDefaults(defineProps<ModalProps>(), {
  show: false,
  title: "default title",
  subtitle: "default subtitle",
  placeholder: "Escribre aqui",
  primaryButtonText: "Enviar",
  secondaryButtonText: "Cancelar",
  isGifModal: false,
});
const emit = defineEmits<ModalEmits>();
const disableButton = computed(() => comment.value.trim() === "");
const comment = ref<string>("");

const onSubmit = () => {
  emit("submit", comment.value);
  comment.value = "";
};

const onClose = () => {
  emit("close");
  comment.value = "";
};
</script>
<style lang="scss" scoped>
.modal {
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  display: flex;
  background-color: rgba(0, 0, 0, 0.6);

  .modal-content {
    background-color: white;
    box-shadow: 0 0 1px 2px rgba(181, 181, 181, 0.202);
    border-radius: 1rem;
    display: grid;
    grid-template-rows: 1fr 2fr 1fr;
    max-width: calc(100% - 10rem);
    max-height: 400px;

    &.gif {
      width: 30rem;
      height: 30rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      padding: 0 1rem;
      text-align: center;

      > img {
        object-fit: cover;
        border-radius: 1rem 1rem 0 0;
      }
      > span {
        font-size: 1.5rem;
        font-weight: 500;
      }
    }

    &.input {
      width: 50rem;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid lightgray;

      > h2 {
        font-weight: 600;
        font-size: 18px;
      }
      .tooltip {
        position: relative;
        display: inline-block;
        cursor: pointer;
      }

      .tooltip .tooltiptext {
        visibility: hidden;
        width: 100px;
        background-color: #333;
        color: #fff;
        text-align: center;
        border-radius: 6px;
        padding: 5px 0;
        position: absolute;
        z-index: 1;
        bottom: 100%;
        right: 50%;
        margin-left: -40px;
        opacity: 0;
        transition: opacity 0.3s;
      }

      .tooltip:hover .tooltiptext {
        visibility: visible;
        opacity: 1;
      }
    }

    .modal-body {
      padding: 1rem;

      > textarea {
        width: 100%;
        height: 100%;
        border: 1px solid lightgray;
        border-radius: 1rem;
        font-size: 14px;
      }
    }

    .modal-footer {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-top: 1px solid lightgray;
      gap: 1rem;
    }
  }
}
</style>
