import clsx from "clsx";

type NavButtonProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
  size: "md" | "lg";
  variant: "light" | "dark";
};

export function NavButton({ children, className, href, size, variant }: NavButtonProps) {
  return (
    <a
      className={clsx(
        "font-ginto whitespace-nowrap leading-none uppercase rounded-full font-semibold text-center",
        variant === "light" && "bg-lightForest text-darkForest",
        variant === "dark" && "bg-darkForest text-lightForest",
        size === "md" && "py-[14px] px-[22px] text-sm",
        size === "lg" && "py-[25px] px-[38px] text-lg",
        className
      )}
      href={href}
    >
      {children}
    </a>
  );
}
