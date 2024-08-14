import { defineStore } from "pinia";
import type { IUser } from "~/utils/interfaces";

interface IState {
  user: IUser;
}

const defaultState: IState = {
  user: {
    isAuthenticated: false,
    isAdmin: false
  },
};

export const useUserStore = defineStore('user-store', {
  state: () => Object.assign({}, defaultState),
  actions: {
    isUserAuthenticated(): boolean {
      return this.$state.user.isAuthenticated;
    },
    isAdmin(): boolean {
      return this.$state.user.isAdmin
    },
    reset() {
      navigateTo("/login");
      Object.assign(this, defaultState);
    }
  }
});
