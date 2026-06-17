type BuildPieceImageStoragePathInput = {
  originalName: string;
  pieceId: string;
  timestamp?: number;
  uniqueId: string;
};

export const buildPieceImageStoragePath = ({
  originalName,
  pieceId,
  timestamp = Date.now(),
  uniqueId,
}: BuildPieceImageStoragePathInput) => {
  const baseName =
    originalName
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase()
      .slice(0, 48) || "piece";

  return `pieces/${pieceId}/${timestamp}-${uniqueId}-${baseName}.webp`;
};
