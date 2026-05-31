"use client";

import Link from "next/link";
import { Heart, Loader2 } from "lucide-react";
import { useTransition } from "react";

import { toggleFavouriteAction } from "@/features/favourites/server/actions";
import { Button } from "@/shared/components/ui/button";

type FavouriteButtonProps = {
  isFavourite: boolean;
  isSignedIn: boolean;
  pieceId: string;
  returnPath: string;
};

export function FavouriteButton({
  isFavourite,
  isSignedIn,
  pieceId,
  returnPath,
}: FavouriteButtonProps) {
  const [pending, startTransition] = useTransition();

  if (!isSignedIn) {
    return (
      <Button asChild variant="outline">
        <Link href={`/auth?next=${encodeURIComponent(returnPath)}`}>
          Log in to save
        </Link>
      </Button>
    );
  }

  return (
    <Button
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          await toggleFavouriteAction(pieceId, returnPath);
        });
      }}
      variant="outline"
    >
      {pending ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Heart className={isFavourite ? "fill-accent text-accent" : ""} />
      )}
      {isFavourite ? "Saved" : "Save to favourites"}
    </Button>
  );
}
