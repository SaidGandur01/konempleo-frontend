import { defineStore } from "pinia";
import { EUser } from "~/utils/enum";
import type { IUser } from "~/utils/interfaces";
import { jwtDecode } from "jwt-decode";
import { isValidToken, roleMapFromToken } from "~/utils/helpers/common";

const defaultState: IUser = {
  isAuthenticated: false,
  role: null,
  token: null,
  userName: null,
};

export const useUserStore = defineStore("user-store", {
  state: () => Object.assign({}, defaultState),
  actions: {
    setToken(token: string) {
      this.token = token;
      localStorage.setItem("token", token);
      const decodeToken = this.decryptToken(token);
      this.setUserRole(roleMapFromToken(decodeToken.role));
      this.userName = decodeToken.fullname
    },
    getToken() {
      const tokenFromStorage = localStorage.getItem("token");
      return this.token || tokenFromStorage;
    },
    decryptToken(token: string): Promise<any> {
      const decoded: any = jwtDecode(token);
      return decoded;
    },
    setUserName(name:string) {
      this.userName = name
    },
    getUserName() {
      const token = this.getToken();
      if (!token) {
        this.reset();
        return null;
      }
      const decoded = this.decryptToken(token);
      return this.userName || decoded.fullname
    },
    setUserRole(role: EUser|null) {
      this.role = role;
      switch (this.role) {
        case EUser.ADMIN:
          navigateTo("/admin/companies");
          break;
        case EUser.ADMIN_COMPANY:
          navigateTo("/company-admin/offers");
          break;
        case EUser.SUPER_ADMIN:
          navigateTo("/super-admin/companies");
          break;
        case EUser.COMPANY:
          navigateTo("/company/offer-list");
          break;
        default:
          navigateTo("/login");
          break;
      }
    },
    getUserRole(): EUser | null {
      const token = this.getToken();
      if (!token) {
        this.reset();
        return null;
      }

      const decoded = this.decryptToken(token);

      return this.role || roleMapFromToken(decoded.role);
    },
    isUserAuthenticated(): boolean {
      const token = this.getToken();
      if (!token) return false;
      const decoded = this.decryptToken(token);
      if (!isValidToken(decoded)) return false;
      this.setUserName(decoded.fullname)
      return true;
    },
    isAdmin(): boolean {
      return this.role === EUser.ADMIN;
    },
    reset() {
      Object.assign(this, defaultState);
      localStorage.removeItem("token");
      return navigateTo("/login");
    },
  },
});
