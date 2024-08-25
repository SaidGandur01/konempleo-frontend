import { defineStore } from "pinia";
import { EUser } from "~/utils/enum";
import type { IUser } from "~/utils/interfaces";

const defaultState: IUser = {
  isAuthenticated: true,
  role: null
};

export const useUserStore = defineStore("user-store", {
  state: () => Object.assign({}, defaultState),
  actions: {
    setUserRole(role: EUser): void {
      this.role = role;
      localStorage.setItem('user_role', role)
      switch (this.role) {
        case EUser.ADMIN:
          navigateTo('/admin/companies')
          break;
        case EUser.COMPANY:
          navigateTo('/company/create-offer')
          break;
        case EUser.SUPER_ADMIN:
          navigateTo('/company/create-offer')
          break;
        default:
          navigateTo('/company/create-offer')
          break;
      }
    },
    getUserRole(): EUser | null {
      const roleFromLocal = localStorage.getItem('user_role') as EUser
      if (!this.role || !roleFromLocal) {
        this.reset()
      }
      return this.role || roleFromLocal;
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
