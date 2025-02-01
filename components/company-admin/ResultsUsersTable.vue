<template>
  <div class="results-table">
    <div class="search-container">
      <CoreSearchBar
        :min-length-search-criteria="1"
        @input="onHandleUserSearch"
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
            <th>Nombre</th>
            <th>Mail</th>
            <th>Procesos</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in paginatedResults" :key="index">
            <td>
              {{ (currentPage - 1) * rowsPerPage + index + 1 }}
            </td>
            <td>{{ result.fullname }}</td>
            <td>{{ result.email }}</td>
            <td>{{ result.offer_count }}</td>
            <td>
              <div :class="['status', 'tooltip', { active: result.active }]">
                <span v-if="result.active" class="tooltiptext">Active</span>
                <span v-else class="tooltiptext">Inactive</span>
              </div>
            </td>
            <td>
              <div class="actions">
                <div class="tooltip">
                  <font-awesome-icon
                    class="icon"
                    :icon="['fas', 'pen-to-square']"
                    :style="{ color: '#00CC88' }"
                    @click="onHandleUserEdit(result.id)"
                  />
                  <span class="tooltiptext">Edit</span>
                </div>
                <div class="tooltip">
                  <div v-if="result.active">
                    <font-awesome-icon
                      class="icon"
                      :icon="['fas', 'user-minus']"
                      :style="{ color: '#5C60F5' }"
                      @click="
                        onHandleUpdateUser({
                          userId: result.id,
                          updateActive: true,
                        })
                      "
                    />
                    <span class="tooltiptext">Suspender</span>
                  </div>
                  <div v-else>
                    <font-awesome-icon
                      class="icon"
                      :icon="['fas', 'user-plus']"
                      :style="{ color: '#5C60F5' }"
                      @click="
                        onHandleUpdateUser({
                          userId: result.id,
                          updateActive: true,
                        })
                      "
                    />
                    <span class="tooltiptext">Activar</span>
                  </div>
                </div>
                <div class="tooltip">
                  <font-awesome-icon
                    class="icon"
                    :icon="['fas', 'trash']"
                    :style="{ color: '#FE3366' }"
                    @click="
                      onHandleUpdateUser({
                        userId: result.id,
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
    <div v-if="results && results.length < 1" class="no-data">
      <span>No hay Usuarios asociados a esta empresa</span>
    </div>
    <div
      v-if="results.length > 1 && paginatedResults.length < 1"
      class="no-data"
    >
      <span>Ningun Usuario hace match con tu busqueda</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ICompanyAdminUsersListTableRow } from "~/utils/interfaces";
import { useHelperStore } from "~/store/helper.store";
import { useUserStore } from "~/store/user.store";
import { getPUTUserPayload } from "~/utils/helpers/common";

const results = ref<ICompanyAdminUsersListTableRow[]>([]);
const filteredResults = ref<ICompanyAdminUsersListTableRow[]>([]);
const currentPage = ref(1);
const rowsPerPage = ref(10);
const userStore = useUserStore();
const helperStore = useHelperStore();
const token = userStore.getToken();
const { $toast } = useNuxtApp();
const myData = ref<any>({});

const onHandleUserSearch = (searchValue: string): void => {
  filteredResults.value = results.value.filter((item) => {
    const name = item.fullname.toLowerCase();
    return name.includes(searchValue.toLowerCase());
  });
  currentPage.value = 1;
};

const onHandleUserEdit = (userId: number): void => {
  navigateTo(`/company-admin/users/edit/${userId}`);
};

const onHandleUpdateUser = async ({
  userId,
  updateActive,
  updateDeleted,
}: {
  userId: number;
  updateActive?: boolean;
  updateDeleted?: boolean;
}) => {
  const [user] = results.value.filter((item) => item.id === userId);
  const params: fetchWrapperProps = {
    method: EFetchMethods.PUT,
    path: `user/admin/${userId}`,
    body: getPUTUserPayload({
      user,
      updateActive,
      updateDeleted,
    }),
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: `Something went wrong ${updateActive ? "updating" : "deleting"} User`,
    });
    results.value = [];
  } else {
    helperStore.renderToastMessage($toast, false, {
      success: `Usuario ${updateActive ? "Actualizado" : "Borrado"} correctamente`,
    });
    const updatedIndex = results.value.findIndex(
      (item) => item.id === data.value.id
    );
    if (updateActive) {
      if (updatedIndex !== -1) {
        results.value[updatedIndex] = {
          ...results.value[updatedIndex],
          active: data.value.active,
        };
      }
    }
    if (data.value.is_deleted === true && updatedIndex !== -1) {
      results.value.splice(updatedIndex, 1);
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

const fetchMyData = async () => {
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
  }
};

onMounted(async () => {
  await fetchMyData();
  const params: fetchWrapperProps = {
    method: EFetchMethods.GET,
    path: `users/company/${myData.value.companies[0].id}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const { data, error } = await useFetchWrapper(params);
  if (error.value) {
    helperStore.renderToastMessage($toast, true, {
      error: "something went wrong bringing Users data",
    });
    results.value = [];
  } else {
    const response = data.value.filter((user) => {
      if (user.role === 3 || user.role === 4) {
        return true;
      }
    });
    results.value = response;
    filteredResults.value = response;
  }
});
</script>
<style lang="scss" scoped>
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
