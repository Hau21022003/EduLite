import { uploadFileApiRequest } from "@/api-requests/upload-file";
import { handleErrorApi } from "@/lib/error";
import { useRef } from "react";

export function useUploadImage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith("image/")
      );
      try {
        const imageUrl = (await uploadFileApiRequest.uploadFile(imageFiles[0]))
          .payload.fileUrl;
        return imageUrl;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({ error });
      }
    }
  };

  const openFileDialog = () => fileInputRef.current?.click();

  return { fileInputRef, handleFileChange, openFileDialog };
}
