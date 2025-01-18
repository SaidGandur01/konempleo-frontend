<template>
  <div class="results-table">
    <div v-if="results && results.length" class="table-wrapper">
      <div class="kpi-section">
        <CoreKpiWrapper
          title-two="20"
          :title-two-font-size="true"
          description-two="Ofertas creadas"
        />
        <CoreKpiWrapper
          title-two="135"
          :has-icon="true"
          :title-two-font-size="true"
          icon-tag-one="fas"
          icon-tag-two="chart-column"
          icon-color="#5C60F5"
          description-one="Candidatos Analizados"
        />
        <CoreKpiWrapper
          title-two="15%"
          title-two-children="(11%)"
          :title-two-font-size="true"
          description-one="EGC"
          description-one-children="Efectividad General de Contacto"
        />
        <CoreKpiWrapper
          title-two="83%"
          :has-icon="true"
          :title-two-font-size="true"
          icon-tag-one="fas"
          icon-tag-two="chart-line"
          icon-color="#5C60F5"
          description-one="Exactitud Meta K"
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
          @input="onHandleOfferSearch"
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
              <th>ECG</th>
              <th>Exactitud</th>
              <th>Tus datos</th>
              <th>CV Asignadas</th>
              <th>Status</th>
              <th>Cierre de oferta</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(result, index) in paginatedResults" :key="index">
              <td class="ranking">{{ result.id }}</td>
              <td style="cursor: pointer" @click="onHandleOffer(result.id)">
                {{ result.name }}
              </td>
              <td>{{ result.vitae_offer_count }}</td>
              <td>{{ result.contacted }}</td>
              <td>{{ result.ecg }}</td>
              <td>{{ result.accuracy }}</td>
              <td>{{ result.tus_datos }}</td>
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
    </div>
    <div v-if="results && results.length < 1" class="no-data">
      <span>No hay ofertas asociadas a esta empresa</span>
    </div>
    <div
      v-if="results.length > 1 && paginatedResults.length < 1"
      class="no-data"
    >
      <span>Ninguna Oferta hace match con tu busqueda</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ICompanyAdminOffersListTableRow } from "~/utils/interfaces";
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";

const results = ref<ICompanyAdminOffersListTableRow[]>([]);
const filteredResults = ref<ICompanyAdminOffersListTableRow[]>([]);
const myData = ref({});
const currentPage = ref(1);
const rowsPerPage = ref(10);
const { $toast } = useNuxtApp();
const helperStore = useHelperStore();
const userStore = useUserStore();
const token = userStore.getToken();

const onHandleOfferSearch = (searchValue: string): void => {
  filteredResults.value = results.value.filter((item) => {
    const name = item.name.toLowerCase();
    return name.includes(searchValue.toLowerCase());
  });
  currentPage.value = 1;
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
  navigateTo(`/company-admin/offer-details/${offerId}`);
};

const fetchOffers = async (companyId: number) => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `offers/company/details/${companyId}`,
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
    results.value = [];
  } else {
    results.value = data.value;
    filteredResults.value = data.value;
  }
};

onMounted(async () => {
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
    await fetchOffers(Number(data.value.companies[0].id));
  }
});
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
