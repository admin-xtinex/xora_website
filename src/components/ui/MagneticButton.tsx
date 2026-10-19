import { useRef, type ReactNode, type MouseEvent } from "react";
import { linkClick } from "@/lib/router";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "link";
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

// Same magnetic feel as the xtinex.com buttons; internal links route client-side.
export function MagneticButton({ href, children, variant = "primary", className, onClick }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.16}px, ${y * 0.2}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const external = /^https?:|^mailto:/.test(href);

  return (
    <a
      ref={ref}
      href={href}
      className={cn("btn", `btn-${variant}`, className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={(e) => {
        onClick?.(e);
        linkClick(href)(e);
      }}
      {...(external && href.startsWith("http") ? { rel: "noopener" } : {})}
    >
      {children}
    </a>
  );
}
