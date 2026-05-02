import authorizeAxios from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";

let accessToken = null;

export const getAccessToken = () => {
  return accessToken;
};

export const setAccessToken = (token) => {
  accessToken = token;
};

export const login = async ({email, password}) => {
   const response =  await authorizeAxios.post(`${API_ROOT}/api/v1/auth/login`, {email, password});
   setAccessToken(response.data.data.accessToken);
   return response.data;
}

export const registerUser = async ({email, password, userName}) => {
    const response = await authorizeAxios.post(`${API_ROOT}/api/v1/auth/register`, {email, password, userName});
    return response.data;
}

export const verifyOtp = async ({email, otp}) => {
    const response = await authorizeAxios.post(`${API_ROOT}/api/v1/auth/verify-otp`, {email, otp});
    return response.data;
}

export const resendOtp = async ({email}) => {
    const response = await authorizeAxios.post(`${API_ROOT}/api/v1/auth/resend-otp`, {email});
    return response.data;
}

export const refreshToken = async () => {
    const response = await authorizeAxios.post(`${API_ROOT}/api/v1/auth/refresh`);
    return response.data;
}

export const logout = async () => {
    const response = await authorizeAxios.post(`${API_ROOT}/api/v1/auth/logout`);
    return response.data;
}

//conversation
export const getAllConversationsByUser = async (userId, keyword = '') => {
    const response = await authorizeAxios.get(`${API_ROOT}/api/v1/conversations/user/${userId}?title=${keyword}`);
    return response.data;
}

//user
export const getCurrentUser = async () => {
    const response = await authorizeAxios.get(`${API_ROOT}/api/v1/users`);
    return response.data;
}

//messages
export const getMessagesByConversationId = async (conversationId, cursor = null) => {
    const response = await authorizeAxios.get(`${API_ROOT}/api/v1/messages?conversationId=${conversationId}&cursor=${cursor}`);
    return response.data;
}
