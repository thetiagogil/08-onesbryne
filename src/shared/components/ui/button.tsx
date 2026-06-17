import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@/shared/utils/cn";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 border text-[11px] font-medium tracking-eyebrow uppercase transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/35 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-foreground bg-foreground text-background hover:border-accent hover:bg-accent hover:text-accent-foreground",
        outline:
          "border-hairline bg-transparent text-foreground hover:border-accent hover:text-accent",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:text-foreground",
        danger:
          "border-destructive/50 bg-transparent text-destructive hover:bg-destructive hover:text-destructive-foreground",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3",
        lg: "h-12 px-6",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

export const Button = ({
  asChild = false,
  className,
  size,
  type = "button",
  variant,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) => {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      className={cn(
        "cursor-pointer",
        buttonVariants({ className, size, variant }),
      )}
      type={asChild ? undefined : type}
      {...props}
    />
  );
};
