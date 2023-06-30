import clsx from "clsx";

type NavLinkProps = {
  className?: string;
  href: string;
  children: React.ReactNode;
};

export function NavLink({ className, children, href }: NavLinkProps) {
  return (
    <a href={href} className={clsx("hover:text-white uppercase font-semibold", className)}>
      {children}
    </a>
  );
}
