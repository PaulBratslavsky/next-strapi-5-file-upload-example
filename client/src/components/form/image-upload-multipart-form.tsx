"use client";

import { useState, useRef, useEffect } from "react";
import { useFormStatus, useFormState } from "react-dom"
import { uploadMultipart } from "@/data/actions/upload-multipart";
import { ImageInput } from "@/components/custom/image-input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const INITIAL_STATE = {
  data: null,
  error: null,
  message: null,
}

export function ImageUploadMultipartForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resetImage, setResetImage] = useState(false);
  const [state, formAction] = useFormState(uploadMultipart, INITIAL_STATE)

  const handleSubmit = (formData: FormData) => {
    if (selectedFile) formData.set("image", selectedFile)
    formAction(formData)
  }

  const handleReset = () => {
    setSelectedFile(null);
    setResetImage(true);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setResetImage(false);
  };

  useEffect(() => {
    if (state.message) {
      handleReset();
    }
  }, [state.message]);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="image">Upload Image</Label>
          <ImageInput onFileChange={handleFileChange} reset={resetImage} />
          {state.error && <ZodErrors error={state.error?.image} />}
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter a description for your image"
            rows={4}
          />
          {state.error && <ZodErrors error={state.error?.description} />}
        </div>
        <div className="flex space-x-2">
          <SubmitButton />
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
      {state.message && <p className="text-green-500">{state.message}</p>}
    </div>
  );
}

export function ZodErrors({ error }: { readonly error: string[] | undefined }) {
  if (!error) return null;
  return (
    <>
      {error.map((err: string, index: number) => (
        <div key={index} className="text-pink-500 text-xs italic mt-1 py-2">
          {err}
        </div>
      ))}
    </>
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