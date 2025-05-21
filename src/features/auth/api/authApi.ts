import { LoginArgs } from "@/features/auth/lib/schemas"
import { BaseResponse } from "@/common/types"
import { MeResponse } from "@/features/auth/api/authApi.types.ts"
import { baseApi } from "@/app/baseApi.ts"

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      login: builder.mutation<BaseResponse<{ userId: number; token: string }>, LoginArgs>({
        query: (body) => ({
          method: "POST",
          url: `/auth/login`,
          body,
        }),
      }),
      logout: builder.mutation<BaseResponse, void>({
        query: () => {
          return {
            method: "DELETE",
            url: `/auth/login`,
          }
        },
      }),
      me: builder.query<BaseResponse<MeResponse>, void>({
        query: () => "/auth/me",
      }),
    }
  },
})

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi
