import * as React from "react";
import { cn } from "@/lib/utils";

function Avatar({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full select-none",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  src,
  alt = "",
  draggable = false,
  ...props
}: React.ComponentProps<"img">) {
  const [hasError, setHasError] = React.useState(false);

  if (!src || hasError) {
    return null;
  }

  return (
    <img
      data-slot="avatar-image"
      src={src}
      alt={alt}
      draggable={draggable}
      onError={() => setHasError(true)}
      className={cn("aspect-square size-full select-none object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted font-semibold text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function AvatarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "flex items-center -space-x-2 space-x-reverse",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup };
