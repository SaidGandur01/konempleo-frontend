<template>
  <div class="results-table">
    <div v-if="results && results.length" class="table-wrapper">
      <div class="kpi-section">
        <CoreKpiWrapper
          :title-two="kpiData.totalOffers || '0'"
          :has-icon="true"
          :title-two-font-size="true"
          icon-tag-one="fas"
          icon-tag-two="briefcase"
          icon-color="#5C60F5"
          description-one="Ofertas Creadas"
        />
        <CoreKpiWrapper
          :title-two="kpiData.totalCandidates || '0'"
          :has-icon="true"
          :title-two-font-size="true"
          icon-tag-one="fab"
          icon-tag-two="searchengin"
          icon-color="#5C60F5"
          description-one="Candidatos Analizados"
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
          description-one="ETC"
          description-one-children="Efectividad Total de Contacto"
        />
      </div>
      <div class="search-date-container">
        <CoreSearchBar
          :min-length-search-criteria="1"
          :should-clear-input="clearInput"
          @input="onHandleOfferSearch"
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
              <th>#</th>
              <th>Nombre Oferta</th>
              <th>Candidatos</th>
              <th>Contactados por Whatsapp</th>
              <th>Tus datos</th>
              <th>CVS Asignados</th>
              <th>Status</th>
              <th>Cierre de oferta</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(result, index) in paginatedResults" :key="index">
              <td class="ranking">
                {{ (currentPage - 1) * rowsPerPage + index + 1 }}
              </td>
              <td style="cursor: pointer" @click="onHandleOffer(result.id)">
                {{ result.name }}
              </td>
              <td>{{ result.vitae_offer_count }}</td>
              <td>{{ result.contacted }}</td>
              <td>{{ result.background_check_count }}</td>
              <td>
                <div class="input-container">
                  <input
                    v-model.number="result.cvCount"
                    class="input"
                    type="number"
                    :min="result.assigned_cvs"
                  />
                  <div class="tooltip">
                    <font-awesome-icon
                      v-if="
                        result.cvCount && result.cvCount > result.assigned_cvs
                      "
                      class="icon"
                      :icon="['fas', 'circle-plus']"
                      :style="{ color: '#00CC88' }"
                      size="lg"
                      @click="onAddCVCount(result)"
                    />
                    <font-awesome-icon
                      v-else
                      :icon="['fas', 'circle-plus']"
                      :style="{ color: 'gray' }"
                      size="lg"
                    />
                    <span class="tooltiptext inverted">Añadir CVs</span>
                  </div>
                </div>
              </td>
              <td>
                <div :class="['status', 'tooltip', { active: result.active }]">
                  <span v-if="result.active" class="tooltiptext">Active</span>
                  <span v-else class="tooltiptext">Inactive</span>
                </div>
              </td>
              <td>
                <div class="tooltip">
                  <div v-if="result.active">
                    <font-awesome-icon
                      class="icon"
                      :icon="['fas', 'circle-xmark']"
                      size="lg"
                      :style="{ color: '#dd2727' }"
                      @click="onSuspendOffer(result.id)"
                    />
                    <span class="tooltiptext">Desactivar Oferta</span>
                  </div>
                  <div v-else>
                    <font-awesome-icon
                      :icon="['fas', 'circle-xmark']"
                      size="lg"
                      :style="{ color: '#725e6e' }"
                    />
                    <span class="tooltiptext">Offerta Inactiva</span>
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
      <div v-else class="no-data">
        <span v-if="dateResults.length && !filteredResults.length"
          >Ninguna Oferta hace match con tu busqueda</span
        >
        <span v-else>No se encontraron Ofertas para las fechas indicadas</span>
      </div>
    </div>
    <div v-else class="no-data">
      <span>No hay ofertas asociadas a esta empresa</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ISuperOffersListTableRow } from "~/utils/interfaces";
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";

const { $toast } = useNuxtApp();
const helperStore = useHelperStore();
const userStore = useUserStore();
const token = userStore.getToken();
const results = ref<ISuperOffersListTableRow[]>([]);
const filteredResults = ref<ISuperOffersListTableRow[]>([]);
const dateResults = ref<ISuperOffersListTableRow[]>([]);
const currentPage = ref(1);
const rowsPerPage = ref(10);
const isDateSearch = ref<boolean>(false);
const clearInput = ref<boolean>(false);
const lastKpiData = ref({});

interface ITableProps {
  companyId: string;
}
const props = withDefaults(defineProps<ITableProps>(), {
  companyId: "",
});

const fetchCompanyOffersDetails = async (dates?: string[]) => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `offers/company/details/${props.companyId}`,
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
      error: "something went wrong bringing offers for this Company",
    });
    results.value = [];
  } else {
    const mappedResponse = data.value.map((item) => {
      return { ...item, cvCount: item.assigned_cvs };
    });
    if (!dates || !dates.length) {
      results.value = mappedResponse;
    }
    dateResults.value = mappedResponse;
    filteredResults.value = mappedResponse;
    currentPage.value = 1;
    clearInput.value = false;
  }
};

const kpiData = computed(() => {
  const data = isDateSearch.value ? dateResults.value : results.value;
  if (data.length) {
    return data.reduce(
      (acc, item, index, arr) => {
        acc.totalCandidates += item.vitae_offer_count;
        acc.contacted += item.contacted;
        acc.interested += item.interested;
        if (index === arr.length - 1) {
          const egc = (acc.contacted / acc.totalCandidates) * 100;
          const etotal = (acc.interested / acc.totalCandidates) * 100;
          acc.totalOffers = arr.length;
          acc.egc = isNaN(egc) ? 0 : egc;
          acc.etotal = isNaN(etotal) ? 0 : etotal;
        }
        return acc;
      },
      {
        totalCandidates: 0,
        totalOffers: 0,
        contacted: 0,
        interested: 0,
        egc: 0,
        etotal: 0,
      }
    );
  }
  return lastKpiData.value;
});

const handleChangeDate = async (dates: string[]) => {
  clearInput.value = true;
  await fetchCompanyOffersDetails(dates);
};

const onClearDate = () => {
  isDateSearch.value = false;
  clearInput.value = true;
  filteredResults.value = results.value;
  dateResults.value = [];
};

const onAddCVCount = async (offer: any) => {
  const payload = {
    assigned_cvs: offer.cvCount,
    active: offer.active,
  };
  const params: fetchWrapperProps = {
    method: EFetchMethods.PUT,
    path: `offers/${offer.id}`,
    body: JSON.stringify(payload),
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "Something went wrong updating Offer",
    });
  } else {
    helperStore.renderToastMessage($toast, false, {
      success: "Oferta actualizada correctamente",
    });
    const updatedIndex = results.value.findIndex(
      (item) => item.id === data.value.id
    );
    if (updatedIndex !== -1) {
      results.value[updatedIndex] = {
        ...results.value[updatedIndex],
        assigned_cvs: data.value.assigned_cvs,
      };
    }
  }
};

const onSuspendOffer = async (offerId: number) => {
  const [offer] = results.value.filter((item) => item.id === offerId);
  const payload = {
    assigned_cvs: offer.assigned_cvs,
    active: !offer.active,
  };
  const params: fetchWrapperProps = {
    method: EFetchMethods.PUT,
    path: `offers/${offerId}`,
    body: JSON.stringify(payload),
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "Something went wrong updating Offer",
    });
  } else {
    helperStore.renderToastMessage($toast, false, {
      success: "Oferta actualizada correctamente",
    });
    const updatedIndex = results.value.findIndex(
      (item) => item.id === data.value.id
    );
    if (updatedIndex !== -1) {
      results.value[updatedIndex] = {
        ...results.value[updatedIndex],
        active: data.value.active,
      };
    }
  }
};

onMounted(() => {
  if (props.companyId) {
    fetchCompanyOffersDetails();
  }
});

const onHandleOfferSearch = (searchValue: string): void => {
  const sourceOfTruth = isDateSearch.value ? dateResults.value : results.value;
  filteredResults.value = sourceOfTruth.filter((item) => {
    const name = item.name.toLowerCase();
    return name.includes(searchValue.toLowerCase());
  });
  clearInput.value = false;
  currentPage.value = 1;
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

const onHandleOffer = (offerId: number): void => {
  navigateTo(`/super-admin/offers/${offerId}?companyId=${props.companyId}`);
};

watch(
  () => props.companyId,
  (newCompanyId: string) => {
    if (newCompanyId) {
      fetchCompanyOffersDetails();
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

      .input-container {
        padding: 0.5rem;
        border-radius: 1rem;
        width: 100px;
        display: flex;
        gap: 1rem;
        align-items: center;

        .input {
          background: var(--background-input-field);
          border: 1px #d1d5dc solid;
          border-radius: 1rem;
          color: var(--color-text-200);
          font-size: 1.6rem;
          width: 100%;

          &:focus {
            outline: none;
            box-shadow: 0 0 0 2px transparent;
          }
        }

        .icon {
          cursor: pointer;
          border-radius: 1rem;
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

        &.inverted {
          left: 50%;
          margin-left: 0;
        }
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
      .actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;

        .icon {
          cursor: pointer;
        }
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
