import { useEffect, useRef, useState } from "react";
import { LogIn, LogOut, Shield, UserRound } from "lucide-react";
import { linkClick, navigate } from "@/lib/router";
import { useAuth } from "./AuthProvider";
import "./auth.css";

/** "Sign in" for visitors; the learner's name with Sign out (and Admin for admins) once signed in. */
export function AccountMenu({ compact = false }: { compact?: boolean }) {
  const { enabled, ready, user, isAdmin, api } = useAuth();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  if (!enabled || !ready) return null;
  if (!user) {
    return (
      <a className="acct-signin" href="/signin" onClick={linkClick("/signin")}>
        <LogIn size={16} aria-hidden />
        {compact ? null : "Sign in"}
        {compact ? <span className="sr-only">Sign in</span> : null}
      </a>
    );
  }
  return (
    <div className="acct" ref={box}>
      <button type="button" className="acct-btn" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span className="acct-avatar" aria-hidden>{(user.name || user.email).slice(0, 1).toUpperCase()}</span>
        {compact ? <span className="sr-only">Account</span> : <span className="acct-name">{user.name}</span>}
      </button>
      {open ? (
        <div className="acct-menu" role="menu">
          <p className="acct-who">
            <UserRound size={14} aria-hidden /> {user.email}
          </p>
          {isAdmin ? (
            <a role="menuitem" href="/admin" onClick={linkClick("/admin", () => setOpen(false))}>
              <Shield size={16} aria-hidden /> Admin
            </a>
          ) : null}
          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await (await api()).signOutUser();
              navigate("/");
            }}
          >
            <LogOut size={16} aria-hidden /> Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
