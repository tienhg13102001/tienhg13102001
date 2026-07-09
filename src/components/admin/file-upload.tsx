"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  id?: string;
  name: string;
  defaultValue?: string;
  accept?: string;
  placeholder?: string;
}

export function FileUpload({
  id,
  name,
  defaultValue = "",
  accept,
  placeholder,
}: FileUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync defaultValue when it changes (e.g. form remounts with new data)
  useEffect(() => {
    setUrl(defaultValue);
  }, [defaultValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Lỗi upload");
      }

      const data = await res.json();
      setUrl(data.url);
      toast.success("Đã tải lên thành công");
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải lên file.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex w-full items-center gap-2">
      <Input
        id={id}
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
      <Button
        type="button"
        variant="secondary"
        disabled={isUploading}
        onClick={() => inputRef.current?.click()}
        className="shrink-0"
      >
        {isUploading ? (
          <Loader2 className="size-4 animate-spin mr-2" />
        ) : (
          <Upload className="size-4 mr-2" />
        )}
        Tải lên
      </Button>
    </div>
  );
}
