<template>
  <div class="upload-wrapper">
    <font-awesome-icon class="icon" :icon="['fas', 'cloud-arrow-up']" />
    <file-pond
      ref="pond"
      name="file"
      class="file-pond-element"
      label-idle='
        <div class="filepond--label-columns">
          <div class="label-column-one">
            <span class="filepond--label-main">Drag and drop files here</span>
            <span class="filepond--label-sub">Limit 200MB per file - PDF, DOCX</span>
          </div>
          <div class="label-column-two">
            <span class="filepond--label-action">Browse files</span>
          </div>
        </div>'
      :allow-multiple="true"
      :accepted-file-types="['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']"
      :max-file-size="200 * 1024 * 1024"
      @addfile="updateButtonState"
      @removefile="updateButtonState"
    />
    <button v-if="false" @click="viewCurrentFiles">View Current Files</button>
  </div>
</template>

<script lang="ts" setup>
import vueFilePond from 'vue-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

interface IUploadFileEmit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (event: "emitfile", value: any): void;
}
const emit = defineEmits<IUploadFileEmit>();
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pond = ref<any>(null);

function viewCurrentFiles() {
  if(pond.value) {
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
  width: 100%;
  position: relative;

  .icon {
    position: absolute;
    z-index: 1001;
    font-size: 4rem !important;
    top: 25px;
    left: 2%;
  }

  .button {
    margin-top: 3rem;
  }
}
</style>
