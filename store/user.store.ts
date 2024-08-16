import { defineStore } from "pinia";
import { EUser } from "~/utils/enum";
import type { IUser } from "~/utils/interfaces";

const defaultState: IUser = {
  isAuthenticated: true,
  role: EUser.ADMIN
};

export const useUserStore = defineStore("user-store", {
  state: () => Object.assign({}, defaultState),
  actions: {
    setUserRole(role: EUser): void {
      this.role = role;
    },
    getUserRole(): EUser {
      return this.role;
    },
    setUserAuthentication(isUserAuthenticated: boolean): void {
      this.isAuthenticated = isUserAuthenticated;
    },
    isUserAuthenticated(): boolean {
      return this.isAuthenticated;
    },
    isAdmin(): boolean {
      return this.role === EUser.ADMIN;
    },
    reset(): void {
      navigateTo("/login");
      Object.assign(this, defaultState);
    },
  },
});
