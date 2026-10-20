import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { LINKS, NAV } from "@/lib/content";
import { linkClick, usePath } from "@/lib/router";
import { cn } from "@/lib/utils";
import { MagneticButton } from "./ui/MagneticButton";
import { AccountLinks, AccountMenu } from "@/auth/AccountMenu";

// The course app (src/features/futures-edge) may only import from this file; it shows the account menu too.
export { AccountMenu };

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

// Home-page sections the scroll highlight follows (everything except the course page).
const SECTIONS = NAV.filter((n) => n.href.startsWith("/#") || n.href === "/");

export function Header() {
  const path = usePath();
  const onCourse = path === "/course";
  const onPricing = path === "/pricing";
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const active = onCourse ? "course" : onPricing ? "pricing" : section;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll highlight on the home page: the last section whose top has passed 40% of the viewport.
  useEffect(() => {
    if (onCourse || onPricing) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current = "home";
      for (const n of SECTIONS) {
        const el = document.getElementById(n.id);
        if (el && el.getBoundingClientRect().top <= line) current = n.id;
      }
      setSection(current);
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
  }, [onCourse, onPricing]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Close the mobile menu whenever the page changes.
  useEffect(() => setOpen(false), [path]);

  const close = () => setOpen(false);

  return (
    <header className={cn("site-header", scrolled && "is-scrolled", open && "is-open")}>
      <div className="header-inner">
        <a href="/" className="brand-link" aria-label="XTINEX XORA — home" onClick={linkClick("/", close)}>
          <BrandLockup />
        </a>

        <nav aria-label="Primary" className="primary-nav">
          <ul>
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  aria-current={active === item.id ? (item.id === "course" || item.id === "pricing" ? "page" : "true") : undefined}
                  className={cn(active === item.id && "is-active")}
                  onClick={linkClick(item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-end">
          <AccountMenu />
          {!onCourse ? (
            <MagneticButton href={LINKS.getStarted} variant="ghost" className="header-cta">
              Get Started
              <ArrowRight size={16} aria-hidden />
            </MagneticButton>
          ) : null}
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
            href={item.href}
            aria-current={active === item.id ? "true" : undefined}
            style={{ transitionDelay: `${i * 40}ms` }}
            onClick={linkClick(item.href, close)}
          >
            {item.label}
          </a>
        ))}
        <AccountLinks onNavigate={close} />
        {!onCourse ? (
          <MagneticButton href={LINKS.getStarted} onClick={close}>
            Get Started
            <ArrowRight size={16} aria-hidden />
          </MagneticButton>
        ) : null}
      </div>
    </header>
  );
}
