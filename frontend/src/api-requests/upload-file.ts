import http from "@/lib/http";
import { UploadRes } from "@/types/upload.type";

export const uploadFileApiRequest = {
  // upload: (body: FormData) => http.post<UploadRes>("/upload/", body),
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return http.post<UploadRes>("/upload", formData);
  },
};
