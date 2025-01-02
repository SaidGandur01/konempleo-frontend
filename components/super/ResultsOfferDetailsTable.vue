<template>
  <div class="results-table">
    <div
      v-if="offerName && paginatedResults && paginatedResults.length"
      class="table-wrapper"
    >
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
          @input="onHandleUserSearch"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Ranking</th>
            <th>Nombre</th>
            <th>Cédula</th>
            <th>Ciudad</th>
            <th>Habilidades encontradas</th>
            <th>Género</th>
            <th>Móvil</th>
            <th>Mail</th>
            <th>Score</th>
            <th>Experiencia (en años)</th>
            <th>Tiempo promedio en cada trabajo</th>
            <th>Nivel Educativo</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in paginatedResults" :key="index">
            <td class="ranking">{{ result.id }}</td>
            <td>{{ result.name }}</td>
            <td>{{ result.dni }}</td>
            <td>{{ result.city }}</td>
            <td>{{ result.skills.join(', ') }}</td>
            <td>{{ result.gender }}</td>
            <td>{{ result.phone }}</td>
            <td>{{ result.mail }}</td>
            <td>{{ result.score }}</td>
            <td>{{ result.average_experience_in_years }}</td>
            <td>{{ result.average_time_per_job }}</td>
            <td>{{ result.education_level }}</td>
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
      <span>No existen datos para mostrar</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { generateSuperCandidatesData } from "~/utils/helpers/super-candidates-generator.helper";
import type { ISuperCandidatesTableRow } from "~/utils/interfaces";
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
const results = ref<ISuperCandidatesTableRow[]>(generateSuperCandidatesData(50));
const currentPage = ref(1);
const rowsPerPage = ref(10);

const onHandleUserSearch = (search: string): void => {
  console.log('search value: ', search)
};

// Computed property to calculate the total number of pages
const totalPages = computed(() => {
  return Math.ceil(results.value.length / rowsPerPage.value);
});

// Computed property to slice the results based on the current page
const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage.value;
  const end = start + rowsPerPage.value;
  return results.value.slice(start, end);
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
      error: "something went wrong bringing Offer",
    });
  } else {
    const mappedOffer = data.value
    console.log('mappedOffer',mappedOffer)
  }
};

watch(
  () => props.offerId,
  async (newOfferId: string) => {
    if(newOfferId) await fetchOfferDetails(Number(newOfferId))
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
  .search-container{
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
      border: 1px darken($color: #F9FAFB, $amount: 10%) solid;

      thead th:nth-child(3),
      tbody td:nth-child(3) {
        // width: 15%;
      }

      tbody tr:first-child {
        td {
          border-top: 1px darken($color: #F9FAFB, $amount: 10%) solid;
        }
      }

      tbody tr:not(:last-child) {
        td {
          border-bottom: 1px darken($color: #F9FAFB, $amount: 10%) solid;
        }
      }

      th,
      td {
        padding: 0.5rem;
        text-align: center;
        font-size: 1.5rem;
      }

      tbody tr:nth-child(2n) {
        background-color: #F9FAFB; /* Adjust this color to your needs */
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
        background-color: #F9FAFB;
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
        background-color: darken($color: #F9FAFB, $amount: 5%);
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

      .icon {
        cursor: pointer;
      }
      .actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;
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
