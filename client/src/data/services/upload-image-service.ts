import { z } from "zod";

// Define the schema for file validation
const FileSchema = z.object({
  name: z.string(),
  type: z.string().startsWith("image/"),
  size: z.number().max(5 * 1024 * 1024), // 5MB max size
});

// Define the schema for the entire form data
const UploadSchema = z.object({
  image: FileSchema,
});

export async function uploadImageService(formData: FormData) {
  try {
    // Validate the form data
    const validatedFields = UploadSchema.parse({
      image: formData.get("image"),
    });

    const file = validatedFields.image;

    // Get the file buffer
    const fileBuffer = await (formData.get("image") as File).arrayBuffer();

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

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();


    // Assuming the API returns a URL to the uploaded image
    return { data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      const errorMessages = error.errors.map((err) => err.message);
      console.error("Validation error:", errorMessages);
      return { error: errorMessages.join(", ") };
    }
    console.error("Upload error:", error);
    return { error: "Failed to upload image" };
  }
}
