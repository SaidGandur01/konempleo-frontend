<template>
  <div class="results-table">
    <div v-if="paginatedResults && paginatedResults.length" class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Icon</th>
            <th>Ranking</th>
            <th>Nombre</th>
            <th>WhatsApp</th>
            <th>Tus Datos</th>
            <th>Movil</th>
            <th>Mail</th>
            <th>Score</th>
            <th>Contratado</th>
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
            <td class="ranking">{{ result.ranking }}</td>
            <td>{{ result.nombre }}</td>
            <td>
              <div class="whatsapp-wrapper">
                <span :class="'status-' + result.whatsapp" />
                <span class="text-info">{{
                  getStatusText(result.whatsapp)
                }}</span>
              </div>
            </td>
            <td>
              <div class="tus-datos-wrapper">
                <span :class="'status-' + result.tusDatos" />
                <span class="text-info">{{
                  getStatusText(result.whatsapp)
                }}</span>
              </div>
            </td>
            <td>{{ result.movil }}</td>
            <td>{{ result.mail }}</td>
            <td>{{ result.score }}</td>
            <td>{{ result.contratado }}</td>
            <td>
              <button class="action-button view-button">View</button>
              <button class="action-button delete-button">
                <font-awesome-icon :icon="['fas', 'trash']" />
              </button>
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
      <span>No existen datos para mostrar</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { generateCandidatesData } from "~/utils/helpers/candidates-generator.helper";
import type { ITableRow } from "~/utils/interfaces";
interface ITableProps {
  offerName: string;
}
const props = withDefaults(defineProps<ITableProps>(), {
  offerName: "",
});
const results = ref<ITableRow[]>(generateCandidatesData(45));
const getStatusText = (
  status: "success" | "pending" | "danger" | "info" | "default"
): string => {
  switch (status) {
    case "success":
      return "Done";
    case "pending":
      return "In progress";
    case "danger":
      return "Error";
    case "info":
      return "Information";
    case "default":
    default:
      return "Default";
  }
};
const currentPage = ref(1);
const rowsPerPage = ref(10);

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

watch(
  () => props.offerName,
  (newValue: string) => {
    console.log("new value: ", newValue);
  }
);
</script>

<style lang="scss" scoped>
.results-table {
  .table-wrapper {
    overflow-x: auto;
    width: 100%;

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 12px;
      overflow: hidden;
      border: 1px darken($color: #f5f9fc, $amount: 10%) solid;

      thead th:nth-child(3),
      tbody td:nth-child(3) {
        // width: 15%;
      }

      tbody tr:first-child {
        td {
          border-top: 1px darken($color: #f5f9fc, $amount: 10%) solid;
        }
      }

      tbody tr:not(:last-child) {
        td {
          border-bottom: 1px darken($color: #f5f9fc, $amount: 10%) solid;
        }
      }

      th,
      td {
        font-family: "Source Sans Pro", sans-serif !important;
        padding: 0.5rem;
        text-align: center;
      }

      tbody tr:nth-child(2n) {
        background-color: #f5f9fc; /* Adjust this color to your needs */
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
        background-color: #f5f9fc;
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
        background-color: darken($color: #f5f9fc, $amount: 5%);
        border-radius: 50%;
        position: relative;

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

  .view-button {
    background-color: #ffffff;
    color: #333333;
    border: 1px solid #d1d5dc;
  }

  .delete-button {
    background-color: #f9f9f9;
    color: #e3342f;
    border: 1px solid #e3342f;
  }

  .view-button:hover {
    background-color: #f0f0f0;
  }

  .delete-button:hover {
    background-color: #e3342f;
    color: #ffffff;
  }
}
</style>
