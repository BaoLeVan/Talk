import authorizeAxios from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";

export const getReceivedRequests = async () => {
  const response = await authorizeAxios.get(`${API_ROOT}/api/v1/friends/requests/received`);
  return response.data.data;
};

export const getFriends = async () => {
  const response = await authorizeAxios.get(`${API_ROOT}/api/v1/friends`);
  return response.data.data;
};
