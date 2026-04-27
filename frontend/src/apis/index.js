import authorizeAxios from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";

export const login = async ({email, password}) => {
   const response =  await authorizeAxios.post(`${API_ROOT}/api/v1/auth/login`, {email, password});
   return response.data;
}

export const registerUser = async ({email, password}) => {
    const response = await authorizeAxios.post(`${API_ROOT}/auth/register`, {email, password});
    return response.data;
}