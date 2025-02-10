<template>
  <div class="results-table">
    <div v-if="results && results.length" class="table-wrapper">
      <div class="kpi-section">
        <CoreKpiWrapper
          title-two="Ofertas"
          :data="kpiData.totalOffers || '0'"
          :has-icon="true"
          :title-two-font-size="true"
          icon-tag-one="fas"
          icon-tag-two="address-book"
          icon-color="#5C60F5"
          :has-secondary-icon="true"
          secondary-icon-tag-one="fab"
          secondary-icon-tag-two="medium"
          secondary-icon-color="gray"
          description-one="Cantidad de"
          description-two="Ofertas creadas"
        />
        <CoreKpiWrapper
          :data="kpiData.totalCandidates || '0'"
          title-two="Candidatos"
          :has-icon="true"
          :title-two-font-size="true"
          icon-tag-one="fas"
          icon-tag-two="people-arrows"
          icon-color="#e79551"
          :has-secondary-icon="true"
          secondary-icon-tag-one="fas"
          secondary-icon-tag-two="user-tie"
          secondary-icon-color="gray"
          description-one="Analizados"
          description-two="por Meta K"
        />
        <CoreKpiWrapper
          :data="`${kpiData.egc.toFixed(1)}%`"
          title-two="EGC"
          :title-two-font-size="true"
          :has-icon="true"
          icon-tag-one="fas"
          icon-tag-two="brain"
          icon-color="#63E6BE"
          :has-secondary-icon="true"
          secondary-icon-tag-one="fab"
          secondary-icon-tag-two="whatsapp"
          secondary-icon-color="gray"
          description-one="Efectividad General"
          description-two="de Contacto"
        />
        <CoreKpiWrapper
          :data="`${kpiData.etotal.toFixed(1)}%`"
          title-two="ETC"
          :title-two-font-size="true"
          :has-icon="true"
          :use-custom-icon="true"
          icon-color="#e79551"
          :has-secondary-icon="true"
          secondary-icon-tag-one="far"
          secondary-icon-tag-two="star"
          secondary-icon-color="gray"
          description-one="Efectividad Total"
          description-two="de Contacto"
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
              <th>Contactados</th>
              <th>Tus Datos</th>
              <th>CV Asignadas</th>
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
              <td>{{ result.assigned_cvs }}</td>
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
    <div v-if="results && results.length < 1" class="no-data">
      <span>No hay ofertas asociadas a esta empresa</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ICompanyOffersListTableRow } from "~/utils/interfaces";
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";

const results = ref<ICompanyOffersListTableRow[]>([]);
const filteredResults = ref<ICompanyOffersListTableRow[]>([]);
const dateResults = ref<ICompanyOffersListTableRow[]>([]);
const currentPage = ref(1);
const rowsPerPage = ref(10);
const { $toast } = useNuxtApp();
const helperStore = useHelperStore();
const userStore = useUserStore();
const token = userStore.getToken();
const isDateSearch = ref<boolean>(false);
const clearInput = ref<boolean>(false);
const lastKpiData = ref({});

const onHandleOfferSearch = (searchValue: string): void => {
  const sourceOfTruth = isDateSearch.value ? dateResults.value : results.value;
  filteredResults.value = sourceOfTruth.filter((item) => {
    const name = item.name.toLowerCase();
    return name.includes(searchValue.toLowerCase());
  });
  currentPage.value = 1;
  clearInput.value = false;
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
          acc.totalOffers = arr.length;
          const egc = (acc.contacted / acc.totalCandidates) * 100;
          const etotal = (acc.interested / acc.totalCandidates) * 100;
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
  await fetchOffers(dates);
};

const onClearDate = () => {
  isDateSearch.value = false;
  clearInput.value = true;
  filteredResults.value = results.value;
  dateResults.value = [];
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
      error: "Something went wrong updating offer",
    });
  } else {
    helperStore.renderToastMessage($toast, false, {
      success: "Oferta actualizada correctamente",
    });
    const updatedIndex = results.value.findIndex(
      (item) => item.id === data.value.id
    );
    if (updatedIndex >= 0) {
      results.value[updatedIndex] = {
        ...results.value[updatedIndex],
        active: data.value.active,
      };
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

const onHandleOffer = (offerId: number): void => {
  navigateTo(`/company/offer-details/${offerId}`);
};

const fetchOffers = async (dates?: string[]) => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `offers/owner/`,
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
      error: "something went wrong bringing offers",
    });
    results.value = [];
  } else {
    if (!dates || !dates.length) {
      results.value = data.value;
    }
    dateResults.value = data.value;
    filteredResults.value = data.value;
    currentPage.value = 1;
    clearInput.value = false;
  }
};

onMounted(async () => {
  await fetchOffers();
});

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
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
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
