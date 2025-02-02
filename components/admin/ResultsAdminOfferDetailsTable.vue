<template>
  <div class="results-table">
    <div v-if="results && results.length" class="table-wrapper">
      <div class="kpi-section">
        <CoreKpiWrapper
          :title-two="kpiData.totalCandidates.toString()"
          :has-icon="true"
          :title-two-font-size="true"
          icon-tag-one="fab"
          icon-tag-two="searchengin"
          icon-color="#ff579a"
          description-one="Candidatos Analizados"
        />
        <CoreKpiWrapper
          :title-two="kpiData.scoreAvg.toFixed(2)"
          :title-two-font-size="true"
          :has-icon="true"
          icon-tag-one="fas"
          icon-tag-two="bullseye"
          icon-color="#ff579a"
          description-one="Score Promedio"
          :description-two="`${kpiData.scoreMin} min - ${kpiData.scoreMax} max`"
        />
        <CoreKpiWrapper
          :title-two="`${kpiData.egc.toFixed(1)}%`"
          :title-two-children="`(${kpiData.contacted} contactados)`"
          :title-two-font-size="true"
          :has-icon="true"
          icon-tag-one="fab"
          icon-tag-two="whatsapp"
          icon-color="#00CC88"
          description-one="EGC"
          description-one-children="Efectividad General de Contacto"
        />
        <CoreKpiWrapper
          :title-two="`${kpiData.etotal.toFixed(1)}%`"
          :title-two-children="`(${kpiData.interested} interesados)`"
          :title-two-font-size="true"
          :has-icon="true"
          icon-tag-one="fa-solid"
          icon-tag-two="phone-volume"
          icon-color="#00CC88"
          description-one="Efectividad Total de Contacto"
        />
      </div>
      <div class="search-date-container">
        <CoreSearchBar
          :min-length-search-criteria="1"
          :should-clear-input="clearInput"
          @input="onHandleCandidateSearch"
        />
        <CoreDatePicker
          :on-clear-date="onClearDate"
          @change="handleChangeDate"
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
              <th>Movil</th>
              <th>Mail</th>
              <th>Score</th>
              <th>Contratado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(result, index) in paginatedResults" :key="index">
              <td class="ranking">
                {{ (currentPage - 1) * rowsPerPage + index + 1 }}
              </td>
              <td>
                <div class="icon" @click="onCandidateClick(result)">
                  {{ result.candidate_name }}
                </div>
              </td>
              <td>{{ result.candidate_phone }}</td>
              <td>{{ result.candidate_mail }}</td>
              <td>{{ result.response_score }}</td>
              <td>
                <div
                  :class="[
                    'status',
                    'tooltip',
                    { active: result.status === 'hired' },
                  ]"
                >
                  <span v-if="result.status === 'hired'" class="tooltiptext"
                    >Contratado</span
                  >
                  <span v-else class="tooltiptext">No Contratado</span>
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
      <div v-else class="no-data">
        <span v-if="dateResults.length && !filteredResults.length"
          >Ningun candidato hace match con tu busqueda</span
        >
        <span v-else
          >No se encontraron Candidatos para las fechas indicadas</span
        >
      </div>
    </div>
    <div v-if="results && results.length < 1" class="no-data">
      <span>No existen datos para mostrar</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ICandidatesTableRow } from "~/utils/interfaces";
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";

interface ITableProps {
  offerId: string;
}
const props = withDefaults(defineProps<ITableProps>(), {
  offerId: "",
});

const { $toast } = useNuxtApp();
const userStore = useUserStore();
const helperStore = useHelperStore();
const token = userStore.getToken();
const results = ref<ICandidatesTableRow[]>([]);
const filteredResults = ref<ICandidatesTableRow[]>([]);
const dateResults = ref<ICandidatesTableRow[]>([]);
const currentPage = ref(1);
const rowsPerPage = ref(10);
const isDateSearch = ref<boolean>(false);
const clearInput = ref<boolean>(false);
const lastKpiData = ref({});

const onHandleCandidateSearch = (searchValue: string): void => {
  const sourceOfTruth = isDateSearch.value ? dateResults.value : results.value;
  filteredResults.value = sourceOfTruth.filter((item) => {
    const name = item.candidate_name.toLowerCase();
    return name.includes(searchValue.toLowerCase());
  });
  clearInput.value = false;
  currentPage.value = 1;
};

const handleChangeDate = async (dates: string[]) => {
  clearInput.value = true;
  await fetchOfferDetails(Number(props.offerId), dates);
};

const onClearDate = () => {
  isDateSearch.value = false;
  clearInput.value = true;
  filteredResults.value = results.value;
  dateResults.value = [];
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

const fetchOfferDetails = async (offerId: number, dates?: string[]) => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `cvoffers/${offerId}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  if (dates && dates.length) {
    isDateSearch.value = true;
    params.path = `${params.path}?start_date=${dates[0]}&close_date=${dates[1]}`;
  }
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing cvs for this Offer",
    });
    results.value = [];
  } else {
    const mappedResponse = data.value.sort(
      (a, b) => b.response_score - a.response_score
    );
    filteredResults.value = mappedResponse;
    dateResults.value = mappedResponse;
    if (!dates || !dates.length) {
      results.value = mappedResponse;
    }
    currentPage.value = 1;
    clearInput.value = false;
  }
};
const kpiData = computed(() => {
  const data = isDateSearch.value ? dateResults.value : results.value;
  if (data.length) {
    return data.reduce(
      (acc, item, index, arr) => {
        acc.scoreSum += item.response_score;
        acc.scoreMin = Math.min(acc.scoreMin, item.response_score);
        acc.scoreMax = Math.max(acc.scoreMax, item.response_score);
        acc.contacted += item.whatsapp_status !== null ? 1 : 0;
        acc.interested += item.whatsapp_status === "interested" ? 1 : 0;
        if (index === arr.length - 1) {
          const egc = (acc.contacted / acc.totalCandidates) * 100;
          const etotal = (acc.interested / acc.totalCandidates) * 100;
          acc.scoreAvg = acc.scoreSum / arr.length;
          acc.totalCandidates = arr.length;
          acc.egc = isNaN(egc) ? 0 : egc;
          acc.etotal = isNaN(etotal) ? 0 : etotal;
        }
        return acc;
      },
      {
        scoreSum: 0,
        scoreMin: Infinity,
        scoreMax: -Infinity,
        scoreAvg: 0,
        totalCandidates: 0,
        contacted: 0,
        interested: 0,
        egc: 0,
        etotal: 0,
      }
    );
  }
  return lastKpiData.value;
});

onMounted(async () => {
  await fetchOfferDetails(Number(props.offerId));
});

watch(
  () => props.offerId,
  async (newOfferId) => {
    // reset values to default
    results.value = [];
    filteredResults.value = [];
    dateResults.value = [];
    if (newOfferId) {
      await fetchOfferDetails(Number(newOfferId));
    }
  }
);

watch(
  kpiData,
  (newKpiData) => {
    lastKpiData.value = newKpiData;
  },
  { immediate: true }
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
  .search-date-container {
    display: flex;
    padding-bottom: 2.5rem;
    gap: 2rem;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.5rem 2.5rem;
    > div {
      width: 30%;
    }
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
        background-color: #f9fafb; /* Adjust this color to your needs */
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

      .tooltip {
        position: relative;
        display: inline-block;
      }

      .tooltip .tooltiptext {
        visibility: hidden;
        width: 80px;
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

      .status {
        background-color: var(--color-danger);
        border: solid 1px #555;
        border-radius: 100px;
        width: 1.5rem;
        height: 1.5rem;
        justify-self: center;

        &.active {
          background-color: var(--color-success);
        }
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
