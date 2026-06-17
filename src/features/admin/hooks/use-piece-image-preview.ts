"use client";

import { type ChangeEvent, useEffect, useRef, useState } from "react";

type PieceImagePreview = {
  name: string;
  sizeLabel: string;
  url: string;
};

export const usePieceImagePreview = () => {
  const [preview, setPreview] = useState<PieceImagePreview | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setPreview({
      name: file.name,
      sizeLabel: formatFileSize(file.size),
      url: objectUrl,
    });
  };

  useEffect(
    () => () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    },
    [],
  );

  return { handleImageChange, preview };
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};
