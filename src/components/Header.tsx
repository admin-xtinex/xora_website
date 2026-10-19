import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { LINKS, NAV } from "@/lib/content";
import { cn, scrollToId } from "@/lib/utils";
import { MagneticButton } from "./ui/MagneticButton";

export function BrandLockup() {
  return (
    <span className="lockup">
      <img src="/brand/xtinex-x.png" alt="" width={44} height={28} decoding="async" />
      <span className="lockup-xtinex">XTINEX</span>
      <span className="lockup-rule" aria-hidden />
      <span className="lockup-xora">XORA</span>
    </span>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: the active item is the last nav section whose top has passed 40% of the viewport.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current: string = NAV[0].id;
      for (const n of NAV) {
        const el = document.getElementById(n.id);
        if (el && el.getBoundingClientRect().top <= line) current = n.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className={cn("site-header", scrolled && "is-scrolled", open && "is-open")}>
      <div className="header-inner">
        <a
          href="#home"
          className="brand-link"
          aria-label="XTINEX XORA — back to top"
          onClick={(e) => {
            e.preventDefault();
            go("home");
          }}
        >
          <BrandLockup />
        </a>

        <nav aria-label="Primary" className="primary-nav">
          <ul>
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "true" : undefined}
                  className={cn(active === item.id && "is-active")}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-end">
          <MagneticButton href={LINKS.getStarted} variant="ghost" className="header-cta">
            Get Started
            <ArrowRight size={16} aria-hidden />
          </MagneticButton>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        {NAV.map((item, i) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            style={{ transitionDelay: `${i * 40}ms` }}
            onClick={(e) => {
              e.preventDefault();
              go(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
        <MagneticButton href={LINKS.getStarted} onClick={() => setOpen(false)}>
          Get Started
          <ArrowRight size={16} aria-hidden />
        </MagneticButton>
      </div>
    </header>
  );
}
