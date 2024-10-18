'use server'

import { uploadImageService } from "@/data/services/upload-image-service"
import { createContentService } from "@/data/services/create-content-service"

import { z } from "zod";

// Define the schema for file validation
const FileSchema = z.object({
  name: z.string(),
  type: z.string().startsWith("image/"),
  size: z.number().max(5 * 1024 * 1024), // 5MB max size
});

// Define the schema for the entire form data
const UploadSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => FileSchema.safeParse(file).success, {
      message: "Invalid file. Must be an image under 5MB.",
    }),
  description: z.string().min(1, { message: "Description is required" }),
});

export async function uploadMultipart(prevState: any, formData: FormData) {
  try {
    const validatedFields = UploadSchema.safeParse({
      image: formData.get("image"),
      description: formData.get("description"),
    });

    if (!validatedFields.success) {
      return {
        ...prevState,
        data: null,
        error:
          validatedFields.error.flatten().fieldErrors
      };
    }

    const uploadedImage = await uploadImageService(formData)

    const contentPayload = {
      data: {
        description: validatedFields.data.description,
        url: uploadedImage.data[0].url,
        image: uploadedImage.data[0].id,
      }
    }

    const uploadedContent = await createContentService(contentPayload)

    return {
      ...prevState,
      data: uploadedContent.data,
      error: null,
      message: "Image uploaded successfully",
    };
  } catch (error) {
    console.error('Upload error:', error)
    return { 
      error: error instanceof Error ? error.message : "An unexpected error occurred during upload"
    }
  }
}