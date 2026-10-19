import { Mail } from "lucide-react";
import { FOOTER, LINKS } from "@/lib/content";
import { linkClick } from "@/lib/router";
import { BrandLockup } from "./Header";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <BrandLockup />
          <p>{FOOTER.line}</p>
          <a className="footer-mail" href={LINKS.contact}>
            <Mail size={16} aria-hidden /> info@xtinex.com
          </a>
        </div>
        {FOOTER.groups.map((g) => (
          <nav key={g.title} aria-label={g.title} className="footer-col">
            <h3>{g.title}</h3>
            <ul>
              {g.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={linkClick(l.href)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="container footer-base">
        <span>© {year} XTINEX. All rights reserved.</span>
        <span>Educational content only. Trading crypto futures involves risk. Not financial advice.</span>
      </div>
    </footer>
  );
}
