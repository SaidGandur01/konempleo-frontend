<template>
  <NuxtLayout name="company">
    <h2>Cargar hojas de vida</h2>
    <div class="form-field">
      <CoreDropdown
        :list-options="dropdownOptions"
        label="Nombre de la oferta"
        placeholder="Seleccione una opción"
        :should-emit-id="true"
        @select="(data) => handleOnInput('offer', data)"
      />
      <span v-if="form.offer.length < 1" class="error-message">{{
        offerError
      }}</span>
    </div>
    <CoreUploadFile @emitfile="onHandleFiles" :clear-input="clearInput" />
    <div class="button">
      <CoreButton
        size="sm"
        label="Guardar"
        :disabled="disabledButton"
        @click="sendFiles"
      />
    </div>
    <CoreModal
      :show="showGif"
      :is-gif-modal="true"
      title="Añadiendo Hojas de vida, esto puede tomar hasta 60 segundos..."
      :subtitle="subtitle"
      placeholder="Cargando..."
    />
  </NuxtLayout>
</template>
<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";
import { fetchTaskIdStatus, getSubtitleInfo } from "~/utils/helpers/common";

definePageMeta({
  middleware: ["protected", "user-guard"],
});

interface ICreateOfferForm {
  offer: string;
}
const form = ref<ICreateOfferForm>({
  offer: "",
});
const { $toast } = useNuxtApp();
const helperStore = useHelperStore();
const userStore = useUserStore();
const token = userStore.getToken();
const offerError = ref<string>("");
const disabledButton = ref<boolean>(true);
const dropdownOptions = ref([]);
const files = ref<Blob[]>([]);
const myData = ref({});
const showGif = ref<boolean>(false);
const clearInput = ref<boolean>(false);
const subtitle = ref<string>("");
const intervalId = ref();

const handleOnInput = (keyField: string, value: string): void => {
  form.value = {
    ...form.value,
    [keyField]: value,
  };
  validateErrorsForm(keyField, value);
  validateForm();
};

const validateErrorsForm = (keyField: string, value: string): void => {
  switch (keyField) {
    case "offer":
      offerError.value =
        isNaN(Number(value)) || Number(value) < 1 ? "Selecciona un opción" : "";
      break;
    default:
      break;
  }
};

const validateForm = (): void => {
  const isOfferNameValid =
    !isNaN(Number(form.value.offer)) &&
    Number(form.value.offer) >= 1 &&
    offerError.value === "";
  const isFilesEmpty = files.value.length;

  disabledButton.value = !(isOfferNameValid && isFilesEmpty);
};

const onHandleFiles = (inputFiles: any): void => {
  files.value = inputFiles;
  validateForm();
};

const fetchMyData = async () => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `users/me`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing User data",
    });
    myData.value = {};
  } else {
    myData.value = data.value;
  }
};

const sendFiles = async () => {
  if (Array.isArray(files.value)) {
    showGif.value = true;
    clearInput.value = false;
    const formData = new FormData();
    for (const file of files.value) {
      formData.append("files", file);
    }
    const params: fetchWrapperProps = {
      method: EFetchMethods.POST,
      body: formData,
      path: `offers/upload-cvs/?companyId=${myData.value.companies[0].id}&offerId=${Number(form.value.offer)}`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data, error } = await useFetchWrapper(params);
    if (error.value) {
      helperStore.renderToastMessage($toast, true, {
        error: "something went wrong uploading cv",
      });
      showGif.value = false;
    } else {
      const response = await fetchTaskIdStatus(data.value.tasks, token);
      const succededTasks = response.map((item) => {
        return item.success.status === 3;
      });
      if (succededTasks.length === data.value.tasks.length) {
        helperStore.renderToastMessage($toast, false, {
          success: "Hojas de vida guardadas exitosamente",
        });
        clearInput.value = true;
      } else {
        helperStore.renderToastMessage($toast, true, {
          error: "something went wrong uploading cv",
        });
      }
      showGif.value = false;
    }
  }
};

onMounted(async () => {
  fetchMyData();
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `offers/owner/`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing offers",
    });
    dropdownOptions.value = [];
  } else {
    // save data in local store for searching purposes
    const mappedResponse = data.value.reduce((acc, offer) => {
      acc.push({ key: offer.id, value: offer.name });
      return acc;
    }, []);
    dropdownOptions.value = mappedResponse;
  }
});

watch(
  showGif,
  (newShowGif) => {
    if (newShowGif) {
      const { subtitle: subtitleTemp, intervalId: intervalIdTemp } =
        getSubtitleInfo();
      // cleaning previous internalId
      clearInterval(intervalId.value);
      subtitle.value = subtitleTemp;
      intervalId.value = intervalIdTemp;
    } else {
      clearInterval(intervalId.value);
    }
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
h2 {
  font-size: 1.7rem;
}
</style>
