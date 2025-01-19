<template>
  <div v-if="show" class="modal">
      <div class="modal-content">
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
interface ModalProps {
  show: boolean;
  title: string;
  placeholder?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}
interface ModalEmits {
  (event: "close"): void;
  (event: "submit", value: string): void;
}

withDefaults(defineProps<ModalProps>(), {
  show: false,
  title: "default title",
  placeholder: "Escribre aqui",
  primaryButtonText: "Enviar",
  secondaryButtonText: "Cancelar",
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
    width: 50rem;
    max-width: calc(100% - 10rem);
    max-height: 400px;

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
