"use client";

import { useState, useRef } from "react";
import { useFormStatus } from "react-dom";

import Image from "next/image";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { uploadMultipart } from "@/data/actions/upload-multipart";
import { ImageInput } from "@/components/custom/image-input";

export function ImageUploader() {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resetImage, setResetImage] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    if (selectedFile) {
      formData.set('image', selectedFile);
    }
    const result = await uploadMultipart(formData);
    if (result.url) {
      setUploadedImageUrl(result.url);
      setSelectedFile(null);
      setResetImage(true);
      if (formRef.current) {
        formRef.current.reset();
      }
    } else if (result.error) {
      console.error(result.error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setUploadedImageUrl(null);
    setResetImage(true);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setResetImage(false);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image">Upload Image</Label>
          <ImageInput onFileChange={handleFileChange} reset={resetImage} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter a description for your image"
            rows={4}
          />
        </div>
        <div className="flex space-x-2">
          <SubmitButton />
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
      {uploadedImageUrl && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Image:</p>
          <div className="relative w-full h-48 rounded-md overflow-hidden">
            <Image
              src={uploadedImageUrl}
              alt="Uploaded"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Uploading..." : "Upload"}
    </Button>
  );
}