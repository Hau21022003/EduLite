import http from "@/lib/http";
import { LoginBody, RegisterBody } from "@/schemas/auth.schema";
import { LoginRes, RegisterRes } from "@/types/auth.type";

const authApiRequest = {
  login: (body: LoginBody) => http.post<LoginRes>("/auth/signin", body),
  register: (body: RegisterBody) =>
    http.post<RegisterRes>("/auth/signup", body),
  forgotPassword: (email: string) =>
    http.get(`/auth/forgot-password/${email}`),
  verifyEmail: (token: string) => http.get(`/auth/verify-email/${token}`),
  auth: (body: {
    sessionToken: string;
    expiresAt: string;
    role: "admin" | "user";
  }) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),
  logoutFromNextServerToServer: (sessionToken: string) =>
    http.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
  logoutFromNextClientToNextServer: (
    force?: boolean | undefined,
    signal?: AbortSignal | undefined
  ) =>
    http.post(
      "/api/auth/logout",
      {
        force,
      },
      {
        baseUrl: "",
        signal,
      }
    ),
};

export default authApiRequest;
