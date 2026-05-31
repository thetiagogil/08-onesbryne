import Link from "next/link";

import { APP_NAME } from "@/shared/constants/app";
import { cn } from "@/shared/utils/cn";

type AppLogoProps = {
  className?: string;
  href?: string;
};

export function AppLogo({ className, href = "/" }: AppLogoProps) {
  return (
    <Link
      className={cn(
        "font-display text-xl tracking-wordmark text-foreground uppercase",
        className,
      )}
      href={href}
    >
      {APP_NAME}
    </Link>
  );
}
