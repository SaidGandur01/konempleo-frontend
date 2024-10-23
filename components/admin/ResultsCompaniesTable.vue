<template>
  <div class="results-table">
    <div
      v-if="paginatedResults && paginatedResults.length"
      class="table-wrapper"
    >
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
          :min-length-search-criteria="2"
          @input="onHandleUserSearch"
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Logo</th>
            <th>Nombre Empresa</th>
            <th>CV Cargados</th>
            <th>Ofertas Totales</th>
            <th>Ofertas Activas</th>
            <th>Ofertas Utilizadas</th>
            <th>Mail</th>
            <th>Usuario Asociado</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in paginatedResults" :key="index">
            <td>
              <div class="avatar">
                <font-awesome-icon
                  class="icon"
                  :icon="['fas', 'user-tie']"
                  size="lg"
                />
              </div>
            </td>
            <td>{{ result.company_name }}</td>
            <td>{{ result.cv_loaded }}</td>
            <td>{{ result.total_offers }}</td>
            <td>{{ result.active_process }}</td>
            <td>{{ result.used_offers }}</td>
            <td>{{ result.associated_user }}</td>
            <td>{{ result.mail }}</td>
            <td>{{ result.status }}</td>
            <td>
              <div class="actions">
                <div class="tooltip">
                  <font-awesome-icon
                    class="icon"
                    :icon="['fas', 'eye']"
                    :style="{ color: '#5C60F5' }"
                    @click="onHandleCompanySelected(result.id)"
                  />
                  <span class="tooltiptext">View</span>
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
      <span>No hay ofertas asociadas a esta empresa</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { generateCompaniesData } from "~/utils/helpers/companies-generator.helper";
import type { ICompaniesListTableRow } from "~/utils/interfaces";

const results = ref<ICompaniesListTableRow[]>(generateCompaniesData(35));

const currentPage = ref(1);
const rowsPerPage = ref(10);

const onHandleUserSearch = (search: string): void => {
  console.log('search value: ', search)
};

const onHandleCompanySelected = (companyId: number): void => {
  console.log("company id: ", companyId);
  navigateTo(`/admin/offer-details/${companyId}`);
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
      .actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 2rem;

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
          top: 100%;
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
