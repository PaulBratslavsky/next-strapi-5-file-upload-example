"use server";

import { revalidatePath } from "next/cache";
import { uploadImageService } from "@/data/services/upload-image-service";
import { createContentService } from "../services/create-content-service";

export async function uploadMultipart(formData: FormData) {
  console.log("from server upload multipart");
  try {
    const uploadedImage = await uploadImageService(formData);

    const payload = {
      data: {
        description: formData.get("description"),
        url: uploadedImage?.data[0].url,
        image: uploadedImage?.data[0].id,
      }
    }
    const uploadedContent = await createContentService(payload)
    console.log(uploadedContent)

    revalidatePath("/");
    return { url: uploadedImage?.data[0].url };
  } catch (error) {
    console.error(error);
    return { error: "Failed to upload data" };
  }
}
