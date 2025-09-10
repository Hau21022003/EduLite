import { storage } from "@/storage/local-storage";
import { Account } from "@/types/account.type";

const USER_KEY = "user";
const SESSION_TOKEN_KEY = "sessionToken";

export interface SessionTokenInfo {
  sessionToken: string;
  expiresAt: string;
}

export const authStorage = {
  getUser() {
    const user = storage.get(USER_KEY) as Account | undefined;
    if (!user) return undefined;

    if (!this.isSessionValid()) {
      this.clear();
      return undefined;
    }

    return user;
  },

  saveUser(user: Account) {
    storage.set(USER_KEY, user);
  },

  saveAuth(user: Account, token: SessionTokenInfo) {
    storage.set(USER_KEY, user);
    storage.set(SESSION_TOKEN_KEY, token);
  },

  getRawSessionToken(): SessionTokenInfo | undefined {
    return storage.get(SESSION_TOKEN_KEY) as SessionTokenInfo | undefined;
  },

  getSessionToken(): SessionTokenInfo | undefined {
    if (!this.isSessionValid()) {
      this.clear();
      return undefined;
    }
    return this.getRawSessionToken();
  },

  saveSessionToken(sessionToken: SessionTokenInfo) {
    return storage.set(SESSION_TOKEN_KEY, sessionToken);
  },

  clear() {
    storage.remove(USER_KEY);
    storage.remove(SESSION_TOKEN_KEY);
  },

  isSessionValid(): boolean {
    const token = this.getRawSessionToken();
    if (!token) return false;
    const expiresAtTime = new Date(token.expiresAt).getTime();
    return Date.now() < expiresAtTime;
  },
};
