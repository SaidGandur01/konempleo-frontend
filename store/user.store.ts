import { defineStore } from "pinia";
import { EUser } from "~/utils/enum";
import type { IUser } from "~/utils/interfaces";

const defaultState: IUser = {
  isAuthenticated: true,
  role: EUser.COMPANY
};

export const useUserStore = defineStore("user-store", {
  state: () => Object.assign({}, defaultState),
  actions: {
    setUserRole(role: EUser): void {
      this.role = role;
      if(role === EUser.ADMIN) {
        navigateTo('/admin')
      } else {
        navigateTo('/company/create-offer')
      }
    },
    getUserRole(): EUser | null {
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
