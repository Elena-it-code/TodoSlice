import { instance } from "@/common/instance"
import { Inputs } from "@/features/auth/lib/schemas"
import { BaseResponse } from "@/common/types"

export const authApi = {
  login(payload: Inputs) {
    return instance.post<BaseResponse<{ userId: number; token: string }>>(`/auth/login`, payload)
  },
}
