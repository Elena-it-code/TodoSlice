import { instance } from "@/common/instance"
import { Inputs } from "@/features/auth/lib/schemas"
import { BaseResponse } from "@/common/types"
import { MeResponse } from "@/features/auth/api/authApi.types.ts"

export const authApi = {
  login(payload: Inputs) {
    return instance.post<BaseResponse<{ userId: number; token: string }>>(`/auth/login`, payload)
  },
  logout() {
    return instance.delete<BaseResponse>(`/auth/login`)
  },
  me() {
    return instance.get<BaseResponse<MeResponse>>("/auth/me")
  },
}
