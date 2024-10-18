'use client'

import { useState, useRef } from "react"
import { useFormStatus, useFormState} from "react-dom"
import { uploadImage } from "@/data/actions/upload-image"
import { ImageInput } from "@/components/custom/image-input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const INITIAL_STATE = {
  data: null,
  error: null,
  message: null,
}

export function ImageUploadSimpleForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [resetImage, setResetImage] = useState(false)
  const [state, formAction] = useFormState(uploadImage, INITIAL_STATE)

  const handleSubmit = (formData: FormData) => {
    if (selectedFile) formData.set("image", selectedFile)
    formAction(formData)
    handleReset()
  }

  const handleReset = () => {
    setSelectedFile(null)
    setResetImage(true)
    if (formRef.current) {
      formRef.current.reset()
    }
  }

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file)
    setResetImage(false)
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
            <ImageInput onFileChange={handleFileChange} reset={resetImage} />
          </div>
        </div>
        <div className="flex space-x-2">
          <SubmitButton />
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </form>
      {state.error && <p className="text-red-500">{state.error}</p>}
      {state.message && <p className="text-green-500">{state.message}</p>}
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Uploading..." : "Upload"}
    </Button>
  )
}