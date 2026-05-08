import authorizeAxios from "~/utils/authorizeAxios";
import { API_ROOT } from "~/utils/constants";

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await authorizeAxios.post(`${API_ROOT}/api/v1/attachments/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};
