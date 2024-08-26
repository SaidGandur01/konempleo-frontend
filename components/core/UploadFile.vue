<template>
  <div class="upload-wrapper">
    <!-- <font-awesome-icon
      class="icon"
      :icon="['fas', 'cloud-arrow-up']" /> -->
    <file-pond
      ref="pond"
      name="file"
      class="file-pond-element"
      :label-idle='labelIdleContent'
      :allow-multiple="true"
      :accepted-file-types="[
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]"
      :max-file-size="200 * 1024 * 1024"
      @addfile="updateButtonState"
      @removefile="updateButtonState"
    />
    <button v-if="false" @click="viewCurrentFiles">View Current Files</button>
  </div>
</template>

<script lang="ts" setup>
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

interface IUploadFileEmit {
  (event: "emitfile", value: any): void;
}
const emit = defineEmits<IUploadFileEmit>();
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);
const pond = ref<any>(null);
const labelIdleContent = computed(
  () => `
  <div class="filepond--label-columns">
    <svg class="w-8 h-8 mb-4 upload-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"></path></svg>
    <div class="label-column-one">
      <span class="filepond--label-main">Click to upload or drag and drop</span>
      <span class="filepond--label-sub">Max. File Size: 200MB - PDF, DOCX</span>
    </div>
    <div class="label-column-two">
      <span class="filepond--label-action">Browse files</span>
    </div>
  </div>
`
);

function viewCurrentFiles() {
  if (pond.value) {
    const files = pond.value.getFiles();
    console.log("Current files:", !files.length);
  }
}

function updateButtonState() {
  if (pond.value) {
    const files = pond.value.getFiles();
    emit("emitfile", files);
  }
}
onMounted(() => {
  updateButtonState();
});
</script>
<style lang="scss" scoped>
.upload-wrapper {
  max-height: 450px;
  overflow: hidden;
  position: relative;
  width: 100%;

  .icon {
    color: var(--color-brand-neutral-500);
    font-size: 5rem !important;
    left: 50%;
    position: absolute;
    top: 30px;
    transform: translateX(-50%);
    z-index: 1001;
  }

  .button {
    margin-top: 3rem;
  }
}
</style>
