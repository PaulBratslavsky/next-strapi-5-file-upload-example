
export async function uploadImageService(formData: FormData) {
  try {
    const file = formData.get("image") as File | null;
    if (!file) throw new Error("No image file provided");

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

    // Assuming the API returns an array of uploaded files
    return { data };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: error instanceof Error ? error.message : "Failed to upload image" };
  }
}