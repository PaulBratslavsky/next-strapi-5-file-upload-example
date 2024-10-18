"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { LucideUpload } from "lucide-react";

interface ImageInputProps {
  onFileChange: (file: File | null) => void;
  reset: boolean;
}

export function ImageInput({ onFileChange, reset }: Readonly<ImageInputProps>) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileChange(file);
    } else {
      setPreview(null);
      onFileChange(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFile(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.files = e.dataTransfer.files;
    }
  }, []);

  useEffect(() => {
    if (reset) {
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [reset]);

  return (
    <Card>
      <CardContent
        className={`p-0 overflow-hidden flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg cursor-pointer ${
          isDragging ? "border-primary" : "border-gray-300"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <Image
              src={preview}
              alt="Preview"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ) : (
          <div className="text-center">
            <LucideUpload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Drag and drop an image here, or click to select a file
            </p>
          </div>
        )}
      </CardContent>
      <Input
        id="image"
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />
    </Card>
  );
}
