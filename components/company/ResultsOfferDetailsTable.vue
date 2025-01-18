<template>
  <div class="results-table">
    <div v-if="results && results.length" class="table-wrapper">
      <div class="kpi-section">
        <CoreKpiWrapper
          title-one="Budget"
          title-two="$750.90"
          :has-icon="true"
          icon-tag-one="fas"
          icon-tag-two="money-bills"
          icon-color="#ff579a"
          :has-increased="true"
          description-one="30%"
          description-two="Since last month"
          type="success"
        />
        <CoreKpiWrapper
          title-two="35"
          title-two-children="(35%)"
          :title-two-font-size="true"
          description-one="Candidatos Aptos"
        />
        <CoreKpiWrapper
          title-two="10"
          title-two-children="(28%)"
          :title-two-font-size="true"
          description-one="Candidatos Contactados"
        />
        <CoreKpiWrapper
          title-one="Total hours"
          title-two="1400"
          :has-icon="true"
          icon-tag-one="fas"
          icon-tag-two="hippo"
          icon-color="#5C60F5"
          :has-decreased="true"
          description-one="-10%"
          description-two="Since last month"
          type="danger"
        />
        <CoreKpiWrapper
          title-two="5%"
          title-two-children=""
          :title-two-font-size="true"
          description-one="Efectividad Total"
        />
      </div>
      <div class="search-container">
        <CoreSearchBar
          :min-length-search-criteria="1"
          @input="onHandleCandidateSearch"
        />
      </div>
      <div
        v-if="paginatedResults && paginatedResults.length"
        class="table-wrapper"
      >
        <table>
          <thead>
            <tr>
              <th>Ranking</th>
              <th>Nombre</th>
              <th>Whatsapp</th>
              <th>Revisar tus datos</th>
              <th>Tus Datos</th>
              <th>Movil</th>
              <th>Mail</th>
              <th>Score</th>
              <th>Contratado</th>
              <th>Comentarios</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(result, index) in paginatedResults" :key="index">
              <td class="ranking">{{ index + 1 }}</td>
              <td>
                <div class="icon" @click="onCandidateClick(result)">
                  {{ result.candidate_name }}
                </div>
              </td>
              <td>
                <div
                  v-if="
                    result.whatsapp_status === 'notsent' ||
                    result.whatsapp_status === null
                  "
                  class="tooltip"
                >
                  <font-awesome-icon
                    class="icon"
                    :icon="['fab', 'whatsapp']"
                    size="xl"
                    style="color: #19e668"
                    @click="onWhatsappClick(result)"
                  />
                  <span class="tooltiptext">Notificar via Whatsapp</span>
                </div>
                <div v-else-if="result.whatsapp_status === 'pending_response'">
                  Enviado
                </div>
                <div v-else>
                  {{ result.whatsapp_status }}
                </div>
              </td>
              <td>
                <div v-if="result.background_check !== null" class="tooltip">
                  <font-awesome-icon
                    :icon="['fas', 'pen-to-square']"
                    :style="{ color: 'gray' }"
                  />
                  <span class="tooltiptext">Antecedentes consultados</span>
                </div>
                <div v-else class="tooltip">
                  <font-awesome-icon
                    class="icon"
                    :icon="['fas', 'pen-to-square']"
                    :style="{ color: '#19e668' }"
                    @click="onBackgroundCheck(result.vitae_offer_id)"
                  />
                  <span class="tooltiptext">Verificar antecedentes</span>
                </div>
              </td>
              <td>
                <div v-if="result.background_check === null">
                  <span>Sin Revisar</span>
                </div>
                <div
                  v-else-if="result.background_check === 'true'"
                  class="bg-check negative"
                >
                  <span>Con hallazgos</span>
                </div>
                <div v-else class="bg-check positive">
                  <span>Sin Antecedentes</span>
                </div>
              </td>
              <td>{{ result.candidate_phone }}</td>
              <td>{{ result.candidate_mail }}</td>
              <td>{{ result.response_score }}</td>
              <td>
                <div class="tooltip">
                  <label class="toggle-label">
                    <input
                      type="checkbox"
                      class="toggle-box"
                      :true-value="'hired'"
                      :false-value="'pending'"
                      @change="onToggleChange(result)"
                    />
                    <div
                      :class="[
                        'toggle-div',
                        { checked: result.status === 'hired' },
                      ]"
                    >
                      <span class="after-element" />
                    </div>
                  </label>
                  <span class="tooltiptext">Marcar como Contratado</span>
                </div>
              </td>
              <td>
                <div class="comments-wrapper">
                  <span class="comment-content">
                    {{ result.comments }}
                  </span>
                  <div class="tooltip">
                    <font-awesome-icon
                      class="icon"
                      :icon="['far', 'comment-dots']"
                      :style="{ color: '#5C60F5' }"
                      @click="handleShowModal(result)"
                    />
                    <span v-if="!!result.comments" class="tooltiptext"
                      >Actualizar Comentario</span
                    >
                    <span v-else class="tooltiptext">Agregar Comentario</span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button :disabled="currentPage === 1" @click="previousPage">
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button :disabled="currentPage === totalPages" @click="nextPage">
            Next
          </button>
        </div>
      </div>
    </div>
    <div v-if="results && results.length < 1" class="no-data">
      <span>No existen datos para mostrar</span>
    </div>
    <div
      v-if="results.length > 1 && paginatedResults.length < 1"
      class="no-data"
    >
      <span>Ningun candidato hace match con tu busqueda</span>
    </div>
  </div>
  <CoreModal
    :show="showModal"
    title="Añadir Comentario"
    placeholder="Escribre tu comentario aqui"
    primary-button-text="Agregar"
    secondary-button-text="Cancelar"
    @close="() => (showModal = false)"
    @submit="onComment"
  />
</template>
<script lang="ts" setup>
import type { ICandidatesTableRow } from "~/utils/interfaces";
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";

interface IOfferData {
  zone: string;
  salary: string;
  contract: string;
  offerName: string;
}
interface ITableProps {
  offerId: string;
  requestOfferData: (id: string) => IOfferData | undefined;
}

const props = withDefaults(defineProps<ITableProps>(), {
  offerId: "",
  requestOfferData: () => undefined,
});
const results = ref<ICandidatesTableRow[]>([]);
const filteredResults = ref<ICandidatesTableRow[]>([]);
const currentPage = ref(1);
const rowsPerPage = ref(10);
const showModal = ref<boolean>(false);
const selectedCandidate = ref<ICandidatesTableRow>();
const { $toast } = useNuxtApp();
const helperStore = useHelperStore();
const userStore = useUserStore();
const token = userStore.getToken();

const onHandleCandidateSearch = (searchValue: string): void => {
  filteredResults.value = results.value.filter((item) => {
    const name = item.candidate_name.toLowerCase();
    return name.includes(searchValue.toLowerCase());
  });
  currentPage.value = 1;
};

const onWhatsappClick = async (candidate: ICandidatesTableRow) => {
  const offerData = props.requestOfferData(props.offerId);
  const payload = {
    candidate_phone: candidate.candidate_phone,
    candidate_name: candidate.candidate_name,
    offer_name: offerData?.offerName,
    zone: offerData?.zone,
    salary: offerData?.salary,
    contract: offerData?.contract,
    offerId: Number(props.offerId),
    vitae_offer_id: candidate.vitae_offer_id,
  };

  const params: fetchWrapperProps = {
    method: EFetchMethods.POST,
    path: `cvoffers/send-message/`,
    body: JSON.stringify(payload),
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong sending the message",
    });
  } else {
    helperStore.renderToastMessage($toast, false, {
      success: "Mensaje de Whatsapp enviado exitosamente",
    });
    console.log(data.value);
  }
};

const onBackgroundCheck = async (vitaeId: number) => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `background-check/${vitaeId}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong checking candidate background",
    });
  } else {
    helperStore.renderToastMessage($toast, false, {
      success: "Antecedentes consultados correctamente",
    });
    console.log(data.value);
  }
};

const onComment = async (comment: string) => {
  if (selectedCandidate.value) {
    const params: fetchWrapperProps = {
      method: EFetchMethods.PUT,
      path: `cvoffers/${selectedCandidate.value.vitae_offer_id}/status`,
      body: JSON.stringify({
        status: selectedCandidate.value.status,
        comments: comment,
      }),
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data, error } = await useFetchWrapper(params);
    if (error.value) {
      helperStore.renderToastMessage($toast, true, {
        error: "something went wrong Updating candidate comment",
      });
      showModal.value = false;
    } else {
      helperStore.renderToastMessage($toast, false, {
        success: "Comentario actualizado correctamente",
      });
      showModal.value = false;
      const updatedIndex = results.value.findIndex(
        (item) => item.vitae_offer_id === selectedCandidate.value.vitae_offer_id
      );
      if (updatedIndex >= 0) {
        results.value[updatedIndex] = {
          ...results.value[updatedIndex],
          comments: data.value.comments,
        };
      }
    }
  }
};

const handleShowModal = (candidate: ICandidatesTableRow) => {
  showModal.value = true;
  selectedCandidate.value = candidate;
};

const onToggleChange = async (candidate: ICandidatesTableRow) => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.PUT,
    path: `cvoffers/${candidate.vitae_offer_id}/status`,
    body: JSON.stringify({
      status: candidate.status === "pending" ? "hired" : "pending",
      comments: candidate.comments,
    }),
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong Updating candidate status",
    });
  } else {
    helperStore.renderToastMessage($toast, false, {
      success: "Status actualizado correctamente",
    });
    const updatedIndex = results.value.findIndex(
      (item) => item.vitae_offer_id === candidate.vitae_offer_id
    );
    if (updatedIndex >= 0) {
      results.value[updatedIndex] = {
        ...results.value[updatedIndex],
        status: data.value.status,
      };
    }
  }
};

const onCandidateClick = async (candidate: ICandidatesTableRow) => {
  if (candidate.url) {
    // temporary => it is supposed that every candidate should have a valid url
    const candidatePath = candidate.url.split(".com/")[1];
    const params: fetchWrapperProps = {
      method: EFetchMethods.GET,
      path: `generate-presigned-url/?file_path=${candidatePath}`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data, error } = await useFetchWrapper(params);
    if (error.value) {
      helperStore.renderToastMessage($toast, true, {
        error: "something went wrong bringing CV",
      });
    } else {
      helperStore.renderToastMessage($toast, false, {
        success: "Abriendo CV del candidato",
      });
      setTimeout(() => {
        window.open(data.value.url);
      }, 2000);
    }
  }
};

// Computed property to calculate the total number of pages
const totalPages = computed(() => {
  return Math.ceil(filteredResults.value.length / rowsPerPage.value);
});

// Computed property to slice the results based on the current page
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return filteredResults.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const fetchOfferDetails = async (offerId: number) => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `cvoffers/${offerId}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing cvs for this offer",
    });
    results.value = [];
  } else {
    const mappedResponse = data.value.sort(
      (a, b) => b.response_score - a.response_score
    );
    results.value = mappedResponse;
    filteredResults.value = mappedResponse;
  }
};

watch(
  () => props.offerId,
  async (newOfferId: string) => {
    if (newOfferId) await fetchOfferDetails(Number(newOfferId));
  }
);
</script>
<style lang="scss" scoped>
.results-table {
  .kpi-section {
    display: flex;
    width: 100%;
    justify-content: space-between;
    gap: 2rem;
    margin-bottom: 5rem;
  }
  .search-container {
    width: 30%;
    padding-bottom: 2.5rem;
    padding-left: 0.5rem;
  }
  .table-wrapper {
    overflow-x: auto;
    width: 100%;

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 12px;
      overflow: hidden;
      border: 1px darken($color: #f9fafb, $amount: 10%) solid;

      thead th:nth-child(3),
      tbody td:nth-child(3) {
        // width: 15%;
      }

      tbody tr:first-child {
        td {
          border-top: 1px darken($color: #f9fafb, $amount: 10%) solid;
        }
      }

      tbody tr:not(:last-child) {
        td {
          border-bottom: 1px darken($color: #f9fafb, $amount: 10%) solid;
        }
      }

      th,
      td {
        padding: 0.5rem;
        text-align: center;
        font-size: 1.5rem;
      }

      tbody tr:nth-child(2n) {
        background-color: #f9fafb;
      }

      th:first-child {
        border-top-left-radius: 12px;
      }
      th:last-child {
        border-top-right-radius: 12px;
      }
      tr:last-child td:first-child {
        border-bottom-left-radius: 12px;
      }
      tr:last-child td:last-child {
        border-bottom-right-radius: 12px;
      }
      th {
        background-color: #f9fafb;
        font-weight: bold;
        padding: 1.5rem 2rem;
      }
      td {
        vertical-align: middle;
        padding: 1.5rem 2rem;
      }

      .bg-check {
        font-weight: 600;

        &.negative {
          color: red;
        }
        &.positive {
          color: green;
        }
      }

      .toggle-label {
        display: flex;
        align-items: center;
        cursor: pointer;
      }

      .toggle-box {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }

      .toggle-div {
        position: relative;
        width: 3rem;
        height: 1.75rem;
        background-color: red;
        border-radius: 99px;
        transition: background-color 0.3s;

        &.checked {
          background-color: #0d9488;
        }

        .after-element {
          content: "";
          position: absolute;
          top: 0.1rem;
          left: 0.15rem;
          width: 1.5rem;
          height: 1.5rem;
          background-color: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 9999px;
          transition: transform 0.3s ease;
        }

        &.checked .after-element {
          transform: translateX(1.25rem);
        }
      }

      .comments-wrapper {
        display: flex;
        gap: 8px;
        justify-content: center;
        align-items: center;
      }

      .avatar {
        height: 30px;
        width: 30px;
        background-color: darken($color: #f9fafb, $amount: 5%);
        border-radius: 50%;
        position: relative;
        margin: 0 auto;

        .icon {
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .ranking {
        font-weight: 700;
      }
      .whatsapp-wrapper,
      .tus-datos-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        gap: 1rem;

        .text-info {
          margin-top: 2px;
        }
      }
      .tooltip {
        position: relative;
        display: inline-block;

        .icon {
          cursor: pointer;
        }
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
      .actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;

      }
        .icon {
          cursor: pointer;
        }
    }
  }
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;

    button {
      padding: 0.5rem 1rem;
      margin: 0 0.5rem;
      border: 1px solid #ccc;
      background-color: #f5f5f5;
      cursor: pointer;
      border-radius: 4px;

      &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }
    }

    span {
      font-weight: 600;
    }
  }
  .no-data {
    padding: 2rem;
    background: var(--color-brand-neutral-700);
    width: 100%;
    display: flex;
    border-radius: 1rem;
    color: var(--color-text-200);
    font-weight: 600;
  }
  .action-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.875rem;
    margin: 0 0.25rem;
  }
}
</style>
