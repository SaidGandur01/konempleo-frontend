import { defineStore } from "pinia";
import type { IUser } from "~/utils/interfaces";

interface IState {
  user: IUser;
}

const defaultState: IState = {
  user: {
    isAuthenticated: false,
    isAdmin: false,
  },
};

export const useUserStore = defineStore("user-store", {
  state: () => Object.assign({}, defaultState),
  actions: {
    setUserType(isAdmin = false): void {
      this.$state.user.isAdmin = isAdmin;
    },
    setUserAuthentication(isUserAuthenticated = false): void {
      this.$state.user.isAuthenticated = isUserAuthenticated;
    },
    isUserAuthenticated(): boolean {
      return this.$state.user.isAuthenticated;
    },
    isAdmin(): boolean {
      return this.$state.user.isAdmin;
    },
    reset(): void {
      navigateTo("/login");
      Object.assign(this, defaultState);
    },
  },
});
