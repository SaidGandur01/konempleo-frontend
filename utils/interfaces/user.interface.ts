import type { EUser } from "~/utils/enum";
export interface IUser {
  isAuthenticated: boolean;
  role: EUser;
}
