import type { EUser } from "~/utils/enum";
export interface IUser {
  isAuthenticated: boolean;
  role: EUser | null;
  token: string | null
  userName: string | null
}
