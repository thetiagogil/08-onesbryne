import Link from "next/link";

import { APP_NAME } from "@/shared/constants/app";
import { cn } from "@/shared/utils/cn";

type AppLogoProps = {
  className?: string;
  href?: string;
};

export const AppLogo = ({ className, href = "/" }: AppLogoProps) => {
  return (
    <Link
      className={cn(
        "font-display tracking-wordmark text-foreground text-xl uppercase",
        className,
      )}
      href={href}
    >
      {APP_NAME}
    </Link>
  );
};
