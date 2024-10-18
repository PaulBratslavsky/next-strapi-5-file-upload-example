"use server";

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
});

export async function uploadImage(prevState: any, formData: FormData) {
  try {
    const validatedFields = UploadSchema.safeParse({
      image: formData.get("image"),
    });

    if (!validatedFields.success) {
      return {
        ...prevState,
        data: null,
        error:
          validatedFields.error.issues[0]?.message || "Invalid image file.",
        message: null,
      };
    }

    const file = validatedFields.data.image;
    const fileBuffer = await file.arrayBuffer();

    // Create a new FormData instance for the API request
    const apiFormData = new FormData();

    apiFormData.append(
      "files",
      new Blob([fileBuffer], { type: file.type }),
      file.name
    );

    // Send the API request
    const response = await fetch("http://localhost:1337/api/upload", {
      method: "POST",
      body: apiFormData,
    });

    if (!response.ok) throw new Error("Failed to upload image");

    const data = await response.json();

    return {
      ...prevState,
      data,
      error: null,
      message: "Image uploaded successfully",
    };

  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      ...prevState,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while uploading the image.",
      message: "Error uploading image",
    };
  }
}
