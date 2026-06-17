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

export const FavouriteButton = ({
  isFavourite,
  isSignedIn,
  pieceId,
  returnPath,
}: FavouriteButtonProps) => {
  const [pending, startTransition] = useTransition();

  if (!isSignedIn) {
    return (
      <Button asChild variant="outline">
        <Link href={`/auth?next=${encodeURIComponent(returnPath)}`}>
          <Heart />
          Log in to save
        </Link>
      </Button>
    );
  }

  return (
    <Button
      aria-pressed={isFavourite}
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
      {pending
        ? "Updating favourites"
        : isFavourite
          ? "Saved to favourites"
          : "Save to favourites"}
    </Button>
  );
};
