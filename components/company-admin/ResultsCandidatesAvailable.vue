<template>
  <div v-if="props.offerId" class="content-wrapper">
    <h2>Candidatos similares para este proceso</h2>
    <div class="results-table">
      <div v-if="results && results.length" class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Ranking</th>
              <th>Nombre</th>
              <th>Ciudad</th>
              <th>Proceso Aplicado</th>
              <th>
                <div class="box-wrapper">
                  Agregar
                  <input
                    :id="'checkbox-item-' + index"
                    type="checkbox"
                    class="box"
                    @change="onSelectAllBoxes"
                  />
                </div>
              </th>
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
              <td>{{ result.candidate_city }}</td>
              <td>
                {{ result.associated_cargos.join(", ") }}
              </td>
              <td>
                <input
                  :id="'checkbox-item-' + index"
                  type="checkbox"
                  class="box"
                  :checked="result.checked"
                  @change="onCheckBox(result)"
                />
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
      <div v-if="results && results.length < 1" class="no-data">
        <span>No hay candidatos disponibles para esta empresa</span>
      </div>
    </div>
    <CoreButton
      size="sm"
      label="Añadir cvs a Oferta"
      type="neutral"
      :disabled="disableButton"
      @click="onSubmitCvs"
    />
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";

export interface ICompanyCvs {
  candidate_city: string;
  candidate_name: string;
  url: string;
  associated_cargos: string[];
  id: number;
  checked?: boolean;
}

const props = defineProps<{
  offerId: string | string[];
}>();

const results = ref<ICompanyCvs[]>([]);
const currentPage = ref(1);
const rowsPerPage = ref(10);
const { $toast } = useNuxtApp();
const helperStore = useHelperStore();
const userStore = useUserStore();
const token = userStore.getToken();
const myData = ref({});
const disableButton = computed(() => {
  return !results.value.some((item) => item.checked);
});

const onSubmitCvs = async () => {
  const selectedCvs = results.value.filter((item) => item.checked);
  const selectedCvsIds = selectedCvs.map((item) => item.id);
  const params: fetchWrapperProps = {
    method: EFetchMethods.POST,
    path: `offers/process-existing-cvs/?offerId=${props.offerId}`,
    body: JSON.stringify(selectedCvsIds),
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong attaching CVs to the offer",
    });
  } else {
    helperStore.renderToastMessage($toast, false, {
      success: "Cvs asignados correctament a la oferta",
    });
    setTimeout(() => {
      navigateTo("/company/offer-details/" + props.offerId);
    }, 1500);
  }
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

const onSelectAllBoxes = (event: Event) => {
  const checkedValue = event.target.checked;
  // update all results checkbox
  results.value = results.value.map((item) => {
    return {
      ...item,
      checked: checkedValue,
    };
  });
};

const onCheckBox = (candidate: ICompanyCvs) => {
  const index = results.value.findIndex((item) => item.id === candidate.id);
  results.value[index] = {
    ...results.value[index],
    checked: !candidate.checked,
  };
};

const onCandidateClick = async (candidate: ICompanyCvs) => {
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

const fetchCompanyCvs = async (companyId: number) => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `companies/${companyId}/cvitae`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing CVs for this company",
    });
    results.value = [];
  } else {
    const mappedResponse = data.value.map((item: ICompanyCvs) => {
      item.checked = false;
      return item;
    });
    results.value = mappedResponse;
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
    await fetchCompanyCvs(Number(data.value.companies[0].id));
  }
});
</script>
<style lang="scss" scoped>
.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}
h2 {
  font-size: 1.7rem;
}

.results-table {
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
        /* Adjust this color to your needs */
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

      .box-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s;
      }

      .box {
        margin-left: 1rem;
        border-radius: 3px;
        width: 1.3rem;
        height: 1.3rem;
      }

      .box:focus {
        outline: none;
        box-shadow: 0 0 0 2px transparent;
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
      }

      .icon {
        cursor: pointer;
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
