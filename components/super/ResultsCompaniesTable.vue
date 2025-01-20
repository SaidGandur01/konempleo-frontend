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
          @input="onHandleCompanySearch"
        />
      </div>
      <div
        v-if="paginatedResults && paginatedResults.length"
        class="table-wrapper"
      >
        <table>
          <thead>
            <tr>
              <th>Logo</th>
              <th>Nombre Empresa</th>
              <th>CV Cargados</th>
              <th>Ofertas Totales</th>
              <th>Ofertas Activas</th>
              <th>Ofertas Utilizadas</th>
              <th>Usuario Asociado</th>
              <th>Mail</th>
              <th>Usuario KONEMPLEO</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <!-- <div class="listening-page spinner">
            <CoreSpinner />
          </div> -->
            <tr v-for="(result, index) in paginatedResults" :key="index">
              <td>
                <div v-if="!result.picture" class="avatar">
                  <font-awesome-icon
                    class="icon"
                    :icon="['fas', 'user-tie']"
                    size="lg"
                  />
                </div>
                <div v-else class="avatar">
                  <img :src="result.picture" alt="Company Logo" class="logo" />
                </div>
              </td>
              <td>{{ result.name }}</td>
              <td>{{ result.cv_count }}</td>
              <td>{{ result.totaloffers }}</td>
              <td>{{ result.activeoffers }}</td>
              <td>{{ result.used_offers }}</td>
              <td>{{ result.recruiter_name }}</td>
              <td>{{ result.recruiter_email }}</td>
              <td>{{ result.admin_name }}</td>
              <td>
                <div
                  :class="['company', 'tooltip', { active: result.active }]"
                  @click="
                    onHandleUpdateCompany({ id: result.id, updateActive: true })
                  "
                >
                  <span v-if="result.active" class="tooltiptext">Suspend</span>
                  <span v-else class="tooltiptext">Activate</span>
                </div>
              </td>
              <td>
                <div class="actions">
                  <div class="tooltip">
                    <font-awesome-icon
                      class="icon"
                      :icon="['fas', 'pen-to-square']"
                      :style="{ color: '#00CC88' }"
                      @click="onHandleCompanyEdit(result.id)"
                    />
                    <span class="tooltiptext">Edit</span>
                  </div>
                  <div class="tooltip">
                    <font-awesome-icon
                      class="icon"
                      :icon="['fas', 'eye']"
                      :style="{ color: '#5C60F5' }"
                      @click="onHandleCompanySelected(result.id)"
                    />
                    <span class="tooltiptext">View</span>
                  </div>
                  <div class="tooltip">
                    <font-awesome-icon
                      class="icon"
                      :icon="['fas', 'trash']"
                      :style="{ color: '#FE3366' }"
                      @click="
                        onHandleUpdateCompany({
                          id: result.id,
                          updateDeleted: true,
                        })
                      "
                    />
                    <span class="tooltiptext">Delete</span>
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
      <span>Ninguna compañia hace match con tu busqueda</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type {
  ISuperCompaniesListTableRow,
  ISuperUsersListTableRow,
} from "~/utils/interfaces";
import { useUserStore } from "~/store/user.store";
import { useHelperStore } from "~/store/helper.store";
import { getPUTCompanyPayload } from "~/utils/helpers/common";

const { $toast } = useNuxtApp();
const userStore = useUserStore();
const helperStore = useHelperStore();
const token = userStore.getToken();
const currentPage = ref(1);
const rowsPerPage = ref(10);
const results = ref<ISuperCompaniesListTableRow[]>([]);
const filteredResults = ref<ISuperCompaniesListTableRow[]>([]);
const companiesCleanResult = ref<ISuperCompaniesListTableRow[]>([]);
const areUsersFetched = ref<boolean>(false);
const users = ref<ISuperUsersListTableRow[]>([]);

onMounted(async () => {
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: "company/all/",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing Companies data",
    });
    companiesCleanResult.value = [];
    results.value = [];
  } else {
    const mappedCompany = data.value.map((company: any) => {
      // need to map the company logo
      const used_offers =
        Number(company.totaloffers) - Number(company.availableoffers);
      return { ...company, used_offers };
    });
    companiesCleanResult.value = data.value;
    results.value = mappedCompany;
    filteredResults.value = mappedCompany;
  }
});

const onHandleCompanySearch = (searchValue: any): void => {
  filteredResults.value = results.value.filter((item) => {
    const name = item.name.toLowerCase();
    return name.includes(searchValue.toLowerCase());
  });
  currentPage.value = 1;
};

const getUsersDataForCompany = async (company) => {
  if (!areUsersFetched.value) {
    const params: fetchWrapperProps = {
      method: EFetchMethods.GET,
      path: `users/`,
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data, error } = await useFetchWrapper(params);
    if (error.value) {
      helperStore.renderToastMessage($toast, true, {
        error: "Something went wrong fetching users data",
      });
      users.value = [];
    } else {
      areUsersFetched.value = true;
      users.value = data.value;
    }
  }
  const [koeAssignedUser] = users.value.filter((user) => {
    return user.email === company.admin_email;
  });
  const [companyUser] = users.value.filter((user) => {
    return user.email === company.recruiter_email;
  });
  return { koeAssignedUser, companyUser };
};

const onHandleUpdateCompany = async ({
  id,
  updateActive,
  updateDeleted,
}: {
  id: number;
  updateActive?: boolean;
  updateDeleted?: boolean;
}) => {
  const [company] = companiesCleanResult.value.filter((item) => item.id === id);
  const { koeAssignedUser, companyUser } =
    await getUsersDataForCompany(company);

  const params: fetchWrapperProps = {
    method: EFetchMethods.PUT,
    path: `company/${id}`,
    body: JSON.stringify(
      getPUTCompanyPayload({
        company,
        updateActive,
        updateDeleted,
        KOEUserId: koeAssignedUser.id,
        companyUser,
      })
    ),
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: `Something went wrong ${updateActive ? "updating" : "deleting"} Company`,
    });
  } else {
    helperStore.renderToastMessage($toast, false, {
      success: `Compañia ${updateActive ? "Actualizada" : "Borrada"} correctamente`,
    });
    const updatedIndex = results.value.findIndex((item) => item.id === id);
    const cleanResultsIndex = companiesCleanResult.value.findIndex(
      (item) => item.id === id
    );
    if (updateActive) {
      if (updatedIndex !== -1) {
        results.value[updatedIndex] = {
          ...results.value[updatedIndex],
          active: data.value.active,
        };
        companiesCleanResult.value[cleanResultsIndex] = {
          ...results.value[cleanResultsIndex],
          active: data.value.active,
        };
      }
    }
    if (data.value.is_deleted === true && updatedIndex !== -1) {
      results.value.splice(updatedIndex, 1);
      companiesCleanResult.value.splice(updatedIndex, 1);
    }
  }
};

const onHandleCompanyEdit = (companyId: number): void => {
  navigateTo(`/super-admin/companies/edit/${companyId}`);
};

const onHandleCompanySelected = (companyId: number): void => {
  navigateTo(`/super-admin/offer-details/${companyId}`);
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
</script>
<style lang="scss" scoped>
// adjust spinner to the page
.spinner {
  height: 50vh;
  display: grid !important;
  place-content: center !important;
}
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
      .avatar {
        height: 35px;
        width: 35px;
        background-color: darken($color: #f9fafb, $amount: 5%);
        position: relative;
        margin: 0 auto;
        border-radius: 50%;

        .icon {
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        
        .logo {
          position: absolute;
          width: 100%;
          border-radius: 50%;
          height: 100%;
          object-fit: cover;
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

      .company {
        background-color: var(--color-danger);
        border: solid 1px #555;
        border-radius: 100px;
        width: 1.5rem;
        height: 1.5rem;
        justify-self: center;
        cursor: pointer;

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
