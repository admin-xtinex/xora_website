import { useSyncExternalStore, type MouseEvent } from "react";

// A tiny client router: the home page, the /course page (or the course app) plus in-page anchors.
// Links are plain hrefs such as "/course", "/#journey" or "#what".

const listeners = new Set<() => void>();

// App decides where each page lands (its #section or the top); stop the browser racing it.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("popstate", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("popstate", cb);
  };
}

const normalise = (p: string) => p.replace(/\/+$/, "") || "/";

export function usePath() {
  return useSyncExternalStore(subscribe, () => normalise(location.pathname));
}

export const isInternal = (href: string) => href.startsWith("/") || href.startsWith("#");

/** Scroll to an element id (or the top), leaving room for the fixed header via scroll-padding. */
export function scrollToTarget(id: string | null, smooth: boolean) {
  const behavior: ScrollBehavior = smooth ? "smooth" : "auto";
  const el = id ? document.getElementById(id) : null;
  if (el) el.scrollIntoView({ behavior, block: "start" });
  else window.scrollTo({ top: 0, behavior });
}

export function navigate(href: string, replace = false) {
  const url = new URL(href, location.href);
  const path = normalise(url.pathname);
  const id = url.hash ? decodeURIComponent(url.hash.slice(1)) : null;

  if (path === normalise(location.pathname)) {
    history.replaceState(null, "", path + url.search + (url.hash || ""));
    scrollToTarget(id, true);
    return;
  }

  // New page: App scrolls to the top (or the #section) as soon as it has rendered.
  history[replace ? "replaceState" : "pushState"](null, "", path + url.search + (url.hash || ""));
  listeners.forEach((l) => l());
  // The course app keeps its own router; tell it the address changed.
  window.dispatchEvent(new Event("fe:navigate"));
}

/** onClick for <a href>: handles internal links client-side, leaves the rest to the browser. */
export function linkClick(href: string, after?: () => void) {
  return (e: MouseEvent) => {
    if (!isInternal(href) || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    after?.();
    navigate(href);
  };
}
