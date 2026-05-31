import { Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

type PieceFormSubmitButtonProps = {
  label: string;
  pending: boolean;
  pendingLabel: string;
};

export function PieceFormSubmitButton({
  label,
  pending,
  pendingLabel,
}: PieceFormSubmitButtonProps) {
  return (
    <Button disabled={pending} type="submit">
      {pending ? <Loader2 className="animate-spin" /> : null}
      {pending ? pendingLabel : label}
    </Button>
  );
}
